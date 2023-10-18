import { NextRequest } from "next/server";

export default async function (props: NextRequest) {
  console.log("page.tsx", props);
}
