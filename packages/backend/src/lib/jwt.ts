import { decode, sign } from "hono/jwt";
import type { JWTPayload } from "hono/utils/jwt/types";

export async function generateJWT(payload: JWTPayload, secret: string, exp: JWTPayload["exp"], alg?: 'HS256') {
  const _payload = { ...payload, exp }
  const encodedData = await sign(_payload, secret, alg)
  return encodedData;
}

export function decodeJWT(token: string) {
  const { header, payload } = decode(token)
  return { header, payload };
}


