import { Message } from "ai";

export type PageProps = {
  params: {};
  searchParams: { [key: string]: string | string[] | undefined };
};

export interface Chat extends Record<string, any> {
  id: string;
  title: string;
  createdAt: Date;
  userId: string;
  path: string;
  messages: Message[];
  sharePath?: string;
}
