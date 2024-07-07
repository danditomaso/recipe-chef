import { type Context, Hono } from "hono";
import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";
import { env } from "@/env";
import { createZodFetcher } from "zod-fetch";
import { getGoogleAccessToken, getGoogleAuthorizationUrlUrl, getGoogleUserInfo } from "@/lib/auth";
import { decodeJWT, generateJWT } from "@/lib/jwt";
import { getAccountByGoogleIdUseCase } from "@/use-cases/accounts";
import { createGoogleUserUseCase } from "@/use-cases/users";
import { afterLoginUrl } from "@/app-config";

const app = new Hono();
const fetchWithZod = createZodFetcher();

app.get("/callback/google", async (c: Context) => {
  // exchange the authentication code for an access token and refresh token
  const code = c.req.query('code')
  if (!code) return c.json({ message: "Missing authentication code" }, 400)

  try {
    const authToken = await getGoogleAccessToken({
      code,
      grant_type: "authorization_code",
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: env.GOOGLE_CALLBACK_URL,
    }, { fetcher: fetchWithZod })
    console.debug("Auth Token", authToken);

    if (!authToken.ok) return c.json({ message: "Error getting auth token" }, 400)

    const userInfo = await getGoogleUserInfo(authToken.value?.access_token, { fetcher: fetchWithZod })

    console.debug("User Info", userInfo);

    if (!userInfo.ok) return c.json({ message: "Error getting user info" }, 400)

    const tokenPayload = {
      email: userInfo.value.email,
      sub: userInfo.value.id,
      exp: authToken.value.expires_in,
      access_token: authToken.value.access_token,
    }

    console.debug("JWT Token payload", tokenPayload);

    const { email, family_name, given_name, picture, id, name, verified_email } = userInfo.value

    const existingUser = await getAccountByGoogleIdUseCase(id)
    if (!existingUser) {
      await createGoogleUserUseCase({
        email,
        family_name,
        given_name,
        id,
        verified_email,
        name,
        picture,
      });
    }

    // Set the expiration to match the google oAuth token
    const cookie = await generateJWT(tokenPayload, env.JWT_SIGNING_SECRET, authToken?.value.expires_in);
    await setSignedCookie(c, "rc_auth", cookie, env.COOKIE_SECRET, { httpOnly: true, path: "/", secure: true, sameSite: "Lax" })

    return c.redirect(afterLoginUrl);

  } catch (error) {
    console.error("Error creating jwt:", error);
    return c.json({ message: "Error creating jwt" }, 400)
  }
});

app.get("/google", async (c: Context) => {
  // get authorization URL from Google, attach all the params as search params

  const authUrl = await getGoogleAuthorizationUrlUrl({ c, envVars: env })
  // Redirect the user to Google Login
  return c.redirect(authUrl)
});


app.get("/logout", async (c: Context) => {
  try {
    const cookie = await getSignedCookie(c, "cf_auth", env.COOKIE_SECRET)

    if (cookie) {
      const decodedToken = decodeJWT(cookie);
      console.debug("Decoded Token", decodedToken);
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
