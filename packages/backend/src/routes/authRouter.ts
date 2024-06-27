import { type Context, Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { callbackSchema } from "@/schemas/auth.schema";
import { envVars } from "@/data/env";
import { createZodFetcher } from "zod-fetch";
import { decodeJWT, generateJWT, getGoogleToken, getUserInfo } from "@/service/auth.service";
import { upsertUser } from "@/data-access/user";

const app = new Hono();
const fetchWithZod = createZodFetcher();

app.get("/callback/google", async (c: Context) => {
  // exchange the authentication code for an access token and refresh token
  const code = c.req.query('code')

  try {
    const schema = await callbackSchema.safeParseAsync({ code });

    if (!schema.success) return c.json({ message: schema.error.issues }, 400)

    const authToken = await getGoogleToken({
      code: schema.data?.code,
      grant_type: "authorization_code",
      client_id: envVars.GOOGLE_CLIENT_ID,
      client_secret: envVars.GOOGLE_CLIENT_SECRET,
      redirect_uri: envVars.GOOGLE_CALLBACK_URL,
    }, { fetcher: fetchWithZod })

    console.debug("Auth Token", authToken);
    if (!authToken.ok) return c.json({ message: "Error getting auth token" }, 400)

    const userInfo = await getUserInfo(authToken.value?.access_token, { fetcher: fetchWithZod })

    console.debug("User Info", userInfo);
    if (!userInfo.ok) return c.json({ message: "Error getting user info" }, 400)

    const tokenPayload = {
      ...userInfo.value,
      access_token: authToken.value.access_token,
    }

    console.debug("JWT Token payload", tokenPayload);
    const { email, family_name, given_name, picture, id } = userInfo.value
    await upsertUser({ email, picture, lastName: family_name, firstName: given_name, providerId: id })

    // Set the expiration to match the google oAuth token
    const cookie = await generateJWT(tokenPayload, envVars.JWT_SIGNING_SECRET, authToken?.value.expires_in);
    setCookie(c, "cf_auth", cookie, { httpOnly: true, path: "/", secure: true, sameSite: "Lax" })

    return c.newResponse(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });

  } catch (error) {
    console.error("Error creating jwt:", error);
    return c.json({ message: "Error creating jwt" }, 400)
  }
});

app.get("/google", (c: Context) => {
  // get authorization URL from Google, attach all the params as search params
  const authorizationUrl = new URL(
    "https://accounts.google.com/o/oauth2/v2/auth",
  );
  authorizationUrl.searchParams.set("client_id", envVars.GOOGLE_CLIENT_ID);
  authorizationUrl.searchParams.set("redirect_uri", envVars.GOOGLE_CALLBACK_URL);
  // this will allow us to retrieve a refresh token
  authorizationUrl.searchParams.set("prompt", "consent");
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", "openid email profile");
  authorizationUrl.searchParams.set("access_type", "offline");

  // Redirect the user to Google Login
  return c.newResponse(null, {
    status: 302,
    headers: {
      Location: authorizationUrl.toString(),
    },
  });
});

app.get("/info", async (c: Context) => {
  const cookie = getCookie(c, "cf_auth")
  if (cookie) {
    const decodedToken = decodeJWT(cookie);
    // Just for demonstration purposes
    if (decodedToken)
      return new Response(JSON.stringify(decodedToken), {
        headers: { "Content-Type": "application/json" },
      });
  }
  return new Response(JSON.stringify({}), {
    headers: { "Content-Type": "application/json" },
  });
});

app.get("/logout", async (c: Context) => {
  try {
    // Revoke the session
    const cookie = getCookie(c, "cf_auth")

    if (cookie) {
      const decodedToken = decodeJWT(cookie);
      console.log("Decoded Token", decodedToken);
    }

    // await revokeGoogleToken(cookie)
    console.error("Error revoking session:")
    deleteCookie(c, "cf_auth")
    return c.newResponse(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    })

  } catch (error) {
    console.error("Error revoking session", error)
  }
})

export default app;
