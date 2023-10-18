import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { DATABASE_HOST, DATABASE_PASSWORD, DATABASE_USERNAME } from "@/env";

// create the connection
const connection = connect({
  host: DATABASE_HOST,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
});

export const db = drizzle(connection);

// import "dotenv/config";
// import { drizzle } from "drizzle-orm/planetscale-serverless";
// import { connect } from "@planetscale/database";

// // create the connection
// const connection = connect({
//   host: process.env.DATABASE_HOST,
//   username: process.env.DATABASE_USERNAME,
//   password: process.env.DATABASE_PASSWORD,
// });

// const db = drizzle(connection);
