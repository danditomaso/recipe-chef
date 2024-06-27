import type { Session } from "@/db/schema";

export type SessionDto = Pick<Session, "userId" | "publicId" | "sessionToken" | "userAgent">

// Use this type to create a new session
export type CreateSessionDto = Pick<Session, "userId" | "publicId" | "sessionToken" | "userAgent">

export type SessionId = {
  id: string;
};

export type CreateSession = (session: CreateSessionDto) => void;
export type DeleteSession = (sessionId: number) => void;
export type UpdateSession = (session: SessionDto) => void;
export type GetSession = () => SessionId | undefined;
export type GeeSessionById = (sessionId: number) => Promise<SessionDto>;
export type GetQueueUserJobByName = (
  userId: string,
  name: string
) => Promise<SessionDto | undefined>;
