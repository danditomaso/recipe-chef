import { getUserRecord } from "@/data-access/user";
import type { CreateUser, GetUserByEMail, UpdateUser } from "@/data-access/user/types";

// export async function getUserProfile(context: { createUserProfile }, data: { token: string }) {
// type UserProfileContext = {
//   createUser: CreateUser
//   updateUser: UpdateUser
//   getUserByEmail: GetUserByEMail
// }

export async function getUserProfile(data: { token: string }) {
  try {


    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${data?.token}`,
        'Content-Type': 'application/json'
      },
    });
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  }

}