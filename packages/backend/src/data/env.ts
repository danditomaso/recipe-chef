import z from 'zod';

const envSchema = z.object({
  DB_HOST: z.string().trim().min(1),
  DB_USER: z.string().trim().min(1),
  DB_PASSWORD: z.string().trim().min(1),
  DB_NAME: z.string().trim().min(1),
  JWT_SIGNING_SECRET: z.string().trim().min(1),
  GOOGLE_CLIENT_ID: z.string().trim().min(1),
  GOOGLE_CLIENT_SECRET: z.string().trim().min(1),
  GOOGLE_CALLBACK_URL: z.string().url(),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

const envServer = envSchema.safeParse({
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  JWT_SIGNING_SECRET: process.env.JWT_SIGNING_SECRET,
  NODE_ENV: process.env.NODE_ENV,
})

if (!envServer.success) {
  console.error(envServer.error.issues);
  throw new Error('There is an error with the server environment variables');
}

export const envVars = envServer.data;