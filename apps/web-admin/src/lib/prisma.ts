"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUsers(page?: number, perPage?: number) {
  try {
    const limit = perPage || 10;
    const offset = ((page || 1) - 1) * limit;

    const [users, count] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          picture: true,
          email: true,
          lastFmUsername: true,
          isActive: true,
          lastSuccessfulScrobble: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    return {
      users,
      count,
    };
  } catch (error) {
    console.error("Error querying users:", error);
    throw error;
  }
}

export async function updateUserStatus(userId: string, isActive: boolean) {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isActive: !isActive,
      },
    });

    return updatedUser.isActive;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
}