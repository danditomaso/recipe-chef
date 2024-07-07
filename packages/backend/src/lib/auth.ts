import type { env } from "@/env";
import type { Context } from "hono";
import type { AnyFetcher, ZodFetcher } from "zod-fetch";
import type { Result } from "@/types";
import { z } from "zod";

interface TokenDataProps {
  code: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  grant_type: "authorization_code" | "refresh_token";
}

interface AuthContext {
  fetcher: ZodFetcher<AnyFetcher>
  onCompleted?: (data: unknown) => void
}

// interface GoogleUser {
//   sub: string;
//   name: string;
//   given_name: string;
//   family_name: string;
//   picture: string;
//   email: string;
//   verified_email: boolean;
//   locale: string;
// }



export const googleTokenDataSchema = z.object({
  access_token: z.string().min(1),
  expires_in: z.number().int(),
  refresh_token: z.string().min(1).optional(),
  scope: z.string().min(1),
  token_type: z.literal("Bearer"),
  id_token: z.string().min(1).optional(),
})
export type GoogleTokenData = z.infer<typeof googleTokenDataSchema>;

export const googleUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  verified_email: z.boolean(),
  name: z.string().min(1),
  given_name: z.string().min(1),
  family_name: z.string().min(1),
  picture: z.string().url(),
})

export type GoogleUser = z.infer<typeof googleUserSchema>;

export const callbackSchema = z.object({
  code: z.string().min(1),
});

export async function getGoogleAuthorizationUrlUrl({
  c,
  envVars,
}: { c: Context; envVars: typeof env }) {
  // get authorization URL from Google, attach all the params as search params
  const authorizationUrl = new URL(
    "https://accounts.google.com/o/oauth2/v2/auth",
  );
  authorizationUrl.searchParams.set("client_id", envVars.GOOGLE_CLIENT_ID);
  authorizationUrl.searchParams.set(
    "redirect_uri",
    envVars.GOOGLE_CALLBACK_URL,
  );
  // this will allow us to retrieve a refresh token
  // authorizationUrl.searchParams.set("prompt", "consent");
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", "openid email profile");
  authorizationUrl.searchParams.set("access_type", "offline");

  return authorizationUrl.toString();
}


export async function getGoogleAccessToken({ client_id, client_secret, code, grant_type, redirect_uri }: TokenDataProps, context: AuthContext): Promise<Result<GoogleTokenData>> {
  const zodFetcher = context.fetcher;

  const tokenEndpoint = new URL("https://oauth2.googleapis.com/token");

  const authParams = new URLSearchParams({
    code,
    grant_type,
    client_id,
    client_secret,
    redirect_uri,
  });

  try {
    const tokens = await zodFetcher(
      googleTokenDataSchema,
      tokenEndpoint.href.toString(),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: authParams.toString(),
      },
    );
    return { ok: true, value: tokens };
  } catch (error) {
    return { ok: false, error };
  }
}


export async function getGoogleUserInfo(accessToken: string, context: AuthContext): Promise<Result<GoogleUser, Error>> {
  const zodFetcher = context.fetcher;
  const userInfo = await zodFetcher(
    googleUserSchema,
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },

  ).catch((error) => {
    throw new Error("Error getting user info:", error.message);
  });
  return { ok: true, value: userInfo };
}

export async function revokeGoogleToken({ access_token }: { access_token: string }) {
  const tokenEndpoint = new URL('https://oauth2.googleapis.com/revoke');
  tokenEndpoint.searchParams.set("token", access_token);

  return fetch(
    tokenEndpoint.toString(),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  ).catch((error) => {
    throw new Error("Error revoking user token:", error.message);
  })
}
