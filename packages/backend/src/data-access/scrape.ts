// import { db } from "@/db";
// import { requests, users } from "@/db/schema";
// import { eq } from "drizzle-orm";

// export async function getRequestByUrl(url: string) {
//   const request = await db.query.requests.findFirst({
//     where: eq(requests.source_url, url)
//   });
//   return request;
// }

// type CreateCompletedScrapeRequestProps = {
//   url: string;
//   userEmail: string;
// }

// export async function createCompletedScrapeRequest({ url, userEmail }: CreateCompletedScrapeRequestProps) {
//   const user = await db.query.users.findFirst({
//     where: eq(users.email, userEmail)
//   });

//   return db.insert(requests).values({
//     // souraace_url: url,
//     status: 'completed',
//     user: user?.email,
//     source_url: url,
//   }).returning({ id: requests.id, });
// }
