import { tokenDataSchema, userDataSchema } from "@/schemas/auth.schema";
import type { TokenDataSchema, UserDataSchema } from "@/schemas/auth.schema";
import type { Result } from "@/types";
import { decode, sign } from "hono/jwt";
import type { JWTPayload } from "hono/utils/jwt/types";
import type { Credentials } from 'google-auth-library'
import type { AnyFetcher, ZodFetcher } from "zod-fetch";

export async function generateJWT(payload: JWTPayload, secret: string, exp: JWTPayload["exp"], alg?: 'HS256') {
  const _payload = { ...payload, exp }
  const encodedData = await sign(_payload, secret, alg)
  return encodedData;
}

export function decodeJWT(token: string) {
  const { header, payload } = decode(token)
  return { header, payload };
}

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

export async function getGoogleToken({ client_id, client_secret, code, grant_type, redirect_uri }: TokenDataProps, context: AuthContext): Promise<Result<TokenDataSchema>> {
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
      tokenDataSchema,
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

export async function getUserInfo(accessToken: string, context: AuthContext): Promise<Result<UserDataSchema, Error>> {
  const zodFetcher = context.fetcher;
  try {
    const userInfo = await zodFetcher(
      userDataSchema,
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
  } catch (error) {
    return { ok: false, error };
  }
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

