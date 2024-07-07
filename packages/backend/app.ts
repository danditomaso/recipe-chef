import { messages } from "@/data/messages/en";
import { Hono, type Context } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { getCookie, getSignedCookie } from "hono/cookie";
import { csrf } from 'hono/csrf';
import { showRoutes } from 'hono/dev'
import config from './config/default'
import loginRouter from "@/routes/loginRouter";
import scrapeRouter from "@/routes/scrapeRouter";
import { decodeJWT } from "@/lib/jwt";
import { env } from "@/env";

const port = config.port

const app = new Hono()

app.use("*", prettyJSON(), csrf());

const api = app.basePath("/api")

api
  .notFound((c) => c.json({ message: messages.error.NOT_FOUND }, 404))
  .onError((err, c) => {
    console.error(err);
    return c.json({ message: messages.error.INTERNAL_SERVER_ERROR }, 500);
  });

// app.get('/logout', async (c) => {
//   await revokeSession(c)
//   return c.text('You have been successfully logged out!')
// })
// app.get('/callback', async (c) => {
//   return processOAuthCallback(c)
// })

// app.get('/', async (c) => {
//   const auth = await getAuth(c)
//   return c.text(`Hello <${auth?.email}>!`)
// })

api.get("/healthcheck", (c) => c.json({ status: "ok" }, 200));

api.get("/info", async (c: Context) => {
  const cookie = await getSignedCookie(c, "rc_auth", env.COOKIE_SECRET)
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

api.route("/scrape", scrapeRouter)
api.route("/login", loginRouter)


if (Bun.env.NODE_ENV === 'development') {
  showRoutes(app, {
    verbose: true,
  });
}

export default {
  port,
  fetch: app.fetch,
}
