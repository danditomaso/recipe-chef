// import { Express, Request, Response } from "express";
// import {
//   createProductHandler,
//   getProductHandler,
//   updateProductHandler,
// } from "./controller/product.controller";
// import {
//   createUserSessionHandler,
//   getUserSessionsHandler,
//   deleteSessionHandler,
//   googleOauthHandler,
// } from "./controller/session.controller";
// import {
//   createUserHandler,
//   getCurrentUser,
// } from "./controller/user.controller";
// import requireUser from "./middleware/requireUser";
// import validateResource from "./middleware/validateResource";
// import {
//   createProductSchema,
//   deleteProductSchema,
//   getProductSchema,
//   updateProductSchema,
// } from "./schema/product.schema";
// import { createSessionSchema } from "./schema/session.schema";
// import { createUserSchema } from "./schema/user.schema";

import login from "@/routes/login";
import type { Hono } from "hono";


function routes(app: Hono) {
  app.get("/healthcheck", (c) => c.json({ status: "ok" }, 200));
  app.route("/auth", login)
}


// app.post("/users", validateResource(createUserSchema), createUserHandler);

// app.get("/me", requireUser, getCurrentUser);

// app.post(
//   "/sessions",
//   validateResource(createSessionSchema),
//   createUserSessionHandler
// );

// app.get("/sessions", requireUser, getUserSessionsHandler);

// app.delete("/sessions", requireUser, deleteSessionHandler);

// app.get("/sessions/oauth/google", googleOauthHandler);

// app.post(
//   "/products",
//   [requireUser, validateResource(createProductSchema)],
//   createProductHandler
// );

// app.put(
//   "/products/:productId",
//   [requireUser, validateResource(updateProductSchema)],
//   updateProductHandler
// );

// app.get(
//   "/products/:productId",
//   validateResource(getProductSchema),
//   getProductHandler
// );

// app.delete(
//   "/products/:productId",
//   [requireUser, validateResource(deleteProductSchema)],
//   getProductHandler
// );

export default routes;
