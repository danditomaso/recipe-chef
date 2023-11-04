// import { sql } from "@vercel/postgres";
import { kv } from "@vercel/kv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sql } from "drizzle-orm";

import { handleURLInput } from "./actions";

export default async function Home() {
  // const { rows } = await sql`SELECT * from CARTS where user_id=${"dand"}`;
  // console.log(rows);
  // await kv.publish("redis", "hello world");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form action={handleURLInput} className="flex gap-2">
        <Input placeholder="Enter a URL" name="url" />
        <Button type="submit" className="bg-gray-950 ">
          Scrape
        </Button>
      </form>
    </main>
  );
}
