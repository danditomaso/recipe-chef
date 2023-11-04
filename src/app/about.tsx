import { kv } from "@vercel/kv";

export default async function About() {
  console.log(await kv.subscribe("redis"));

  return <></>;
}
