import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { connect } from "@planetscale/database";

const config = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};

export const db = connect(config);
// const results = await conn.execute("select 1 from dual where 1=?", [1]);
// return results;

export const prisma = new PrismaClient();
