import type { User } from "@/db/schema";

// Use this type to get a user or update a user
export type UserDto = Pick<User, "id" | "publicId" | "providerId" | "email" | "picture" | "firstName" | "lastName">

// Use this type to create a new recipe
export type CreateUserDto = Pick<User, "email" | "providerId" | "picture" | "firstName" | "lastName">

export type UserId = Pick<User, "id">
export type UserEmail = Pick<User, "email">

export type CreateUser = (user: CreateUserDto) => void;
export type DeleteUser = (id: number) => void;
export type UpdateUser = (user: UserDto) => void;
export type GetUser = (id: string) => User | undefined;
export type GetUserByEMail = (email: string) => User | undefined;