import { db } from "../prismaClient";

export async function getUserByEmail(email: string) {
  return await db.user.findFirst({ where: { email } });
}

export async function getUserById(id: string) {
  return await db.user.findUnique({ where: { id } });
}
