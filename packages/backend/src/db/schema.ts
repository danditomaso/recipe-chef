import { integer, text, sqliteTableCreator, index, } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const accountTypeEnum = ["email", "google", "github"] as const;
export const requestTypeEnum = ["pending", "in-progress", "completed", "failed"] as const;

const sqliteTable = sqliteTableCreator((name) => `rc_${name}`);

export const users = sqliteTable("user", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  email: text("email").unique(),
  emailVerified: integer("verified_email", { mode: "timestamp" }),
});

export const profiles = sqliteTable("profile", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  displayName: text("display_name"),
  imageId: text("image_id"),
  image: text("image"),
  bio: text("bio").notNull().default(""),
});

export const accounts = sqliteTable("account", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  accountType: text("account_type", { enum: accountTypeEnum }).notNull(),
  githubId: text("github_id").unique(),
  googleId: text("google_id").unique(),
  password: text("password"),
  salt: text("salt"),
});

export const magicLinks = sqliteTable("magic_links", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  token: text("token"),
  tokenExpiresAt: integer("token_expires_at", { mode: "timestamp" }).notNull(),
});

export const resetTokens = sqliteTable("reset_tokens", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  token: text("token"),
  tokenExpiresAt: integer("token_expires_at", { mode: "timestamp" }).notNull(),
});

export const verifyEmailTokens = sqliteTable("verify_email_tokens", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  token: text("token"),
  tokenExpiresAt: integer("token_expires_at", { mode: "timestamp" }).notNull(),
});

// export const requests = sqliteTable("request", {
//   id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
//   publicId: text("public_id").notNull().unique().default(nanoid(10)),
//   user: integer("user_id", { mode: "number" })
//     .references(() => users.email, {
//       onDelete: "cascade",
//     })
//     .notNull(),
//   source_url: text("source_url"),
//   status: text("status", { enum: requestTypeEnum }).notNull(),
//   createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
//   updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdateFn(() => new Date()),
// });

export const recipes = sqliteTable("recipes", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  publicId: text('public_id').notNull().unique().default(nanoid(10)),
  source_url: text('source_url').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  imageUrls: text('imageUrls', { mode: 'json' }),
  authors: text('authors', { mode: 'json' }),
  prepTime: text('prepTime'),
  totalTime: text('totalTime'),
  cookTime: text('cookTime'),
  ingredients: text('ingredients', { mode: 'json' }),
  instructions: text('instructions', { mode: 'json' }),
  yield: text('yield'),
  cuisineType: text('cuisineType'),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdateFn(() => new Date()),

}, (table) => {
  return {
    sourceUrlIdx: index("source_url_idx").on(table.source_url),
    publicIdIdx: index("public_id_idx").on(table.publicId),
  }
});


export type Profile = typeof profiles.$inferSelect;
// export type Request = typeof requests.$inferSelect;
export type User = typeof users.$inferSelect;
export type Recipe = typeof recipes.$inferSelect;
