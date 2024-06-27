import { messages } from "@/data/messages/en";
import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { showRoutes } from 'hono/dev'
import config from './config/default'
import routes from "./routes";
import authRouter from "@/routes/authRouter";
import { envVars } from "@/data/env";

const port = config.port
envVars

const app = new Hono()

app.use("*", prettyJSON());


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
api.route("/auth", authRouter)


if (Bun.env.NODE_ENV === 'development') {
  showRoutes(app, {
    verbose: true,
  });
}

export default {
  port,
  fetch: app.fetch,
}