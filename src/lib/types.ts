import { z } from "zod";

export type PageProps = {
  params: {};
  searchParams: { [key: string]: string | string[] | undefined };
};
