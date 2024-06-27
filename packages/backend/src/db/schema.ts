import { boolean, integer, json, pgTable, primaryKey, serial, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from 'nanoid';


// TABLES
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  publicId: text('public_id').notNull().unique().$default(() => nanoid(10)),
  picture: text('picture'),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  providerId: text('provider_id').notNull(),
  isDeleted: boolean("isDeleted").default(false),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().$onUpdate(() => new Date()),
});

export const sessions = pgTable("sessions", {
  userId: integer("user.id").unique().notNull().references(() => users.id, { onDelete: 'cascade' }),
  publicId: text('public_id').notNull().unique().$default(() => nanoid(10)),
  sessionToken: text('session_token').notNull().unique().$default(() => nanoid(64)),
  userAgent: text('user_agent').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().$onUpdate(() => new Date()),
});

export const jobsToUsers = pgTable("users_to_jobs", {
  userId: integer("user.id"),
  jobId: integer("job.id"),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.jobId] }),
  };
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  url: text('url'),
  ownedBy: integer('owned_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
  publicId: text('public_id').notNull().unique().$default(() => nanoid(10)),
  isCompleted: boolean('isCompleted').default(false),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().$onUpdate(() => new Date()),
});

export const jobsToRecipes = pgTable("jobs_to_recipes", {
  jobId: integer("job.id"),
  recipeId: integer("recipe.id"),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.recipeId, table.jobId] }),
  };
});

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  publicId: text('public_id').notNull().unique().$default(() => nanoid(10)),
  original_url: text('url'),
  author: json('author'),
  prepTime: text('prepTime'),
  totalTime: text('totalTime'),
  cookTime: text('cookTime'),
  recipeIngredient: json('recipeIngredient'),
  recipeInstructions: json('recipeInstructions'),
  recipeYield: text('recipeYield'),
  recipeCuisine: text('recipeCuisine'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().$onUpdate(() => new Date()),
});

export type Job = typeof jobs.$inferSelect;
export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Recipe = typeof recipes.$inferSelect;