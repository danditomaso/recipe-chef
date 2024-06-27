export default {
  port: 8000,
  origin: "http://localhost:3000",
  dbName: 'recipes',
  dbUri: `postgresql://${Bun.env.DB_USER}:${Bun.env.DB_PASSWORD}@${Bun.env.DB_HOST}/${Bun.env.DB_NAME}`,
  saltWorkFactor: 10,
  sessionSecet: Bun.env.SESSION_SECRET,
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
  jwtCookieTtl: "1d",
  jwtSigningSecret: Bun.env.JWT_SIGNING_SECRET,
  googleClientId:
    Bun.env.GOOGLE_CLIENT_ID,
  googleClientSecret: Bun.env.GOOGLE_CLIENT_SECRET,
  googleOauthRedirectUrl: Bun.env.GOOGLE_CALLBACK_URL
};
