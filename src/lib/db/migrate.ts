import { migrate } from "drizzle-orm/libsql/migrator";
import { buildDbClient } from "./dbClient";
import { drizzle } from "drizzle-orm/libsql";

const db = drizzle(createClient({ url, authToken }), { schema });
async function main() {
  try {
    await migrate(buildDbClient, {
      migrationsFolder: "db/migrations",
    });
    console.log("Tables migrated!");
    process.exit(0);
  } catch (error) {
    console.error("Error performing migration: ", error);
    process.exit(1);
  }
}

main();
