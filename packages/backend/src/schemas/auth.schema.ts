import { z } from "zod";

// export const tokenEndpointSchema = z.object({
//   host: z.string().url(),
//   origin: z.string().min(1),
//   code: z.string().min(1),
//   grant_type: z.literal("authorization_code"),
//   prompt: z.literal("consent"),
//   client_id: z.string().min(1),
//   client_secret: z.string().min(1),
//   redirect_uri: z.string().url(),
// });

export const tokenDataSchema = z.object({
  access_token: z.string().min(1),
  expires_in: z.number().int(),
  refresh_token: z.string().min(1).optional(),
  scope: z.string().min(1),
  token_type: z.literal("Bearer"),
  id_token: z.string().min(1).optional(),
})
export type TokenDataSchema = z.infer<typeof tokenDataSchema>;

export const userDataSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  verified_email: z.boolean(),
  name: z.string().min(1),
  given_name: z.string().min(1),
  family_name: z.string().min(1),
  picture: z.string().url(),
})
export type UserDataSchema = z.infer<typeof userDataSchema>;

export const callbackSchema = z.object({
  code: z.string().min(1),
});

