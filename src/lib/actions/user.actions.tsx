"use server";
import { z } from "zod";
import { userFormSchema } from "../validator";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { handleError, hashPassword } from "../utils";
import { IUser } from "@/interfaces";

export type UserFormData = z.infer<typeof userFormSchema>;

export async function createUser({
  user,
  path,
}: {
  user: UserFormData;
  path: string;
}): Promise<{ success: boolean; errors?: { field: string; msg: string }[] }> {
  try {
    const success = false;
    const errors: { field: string; msg: string }[] = [];
    const validatedData = userFormSchema.parse(user);
    const exists = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username },
        ],
      },
    });

    if (exists?.email === validatedData.email) {
      errors.push({
        field: "email",
        msg: "Cet email est déjà utilisé.",
      });
    }
    if (exists?.username === validatedData.username) {
      errors.push({
        field: "username",
        msg: "Ce nom d'utilisateur est déjà utilisé.",
      });
    }
    if (errors.length > 0) {
      return { success, errors };
    }

    const newPerson = await prisma.person.create({
      data: {
        firstname: validatedData.firstname,
        lastname: validatedData.lastname,
        phone_number: validatedData.phone_number,
        address: validatedData.address,
        gender: validatedData.gender,
        date_of_birth: validatedData.date_of_birth,
      },
    });
    const password = await hashPassword(validatedData.password);
    await prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        password: password,
        role_id: validatedData.role_id,
        person_id: newPerson.id,
        auth_allowed: validatedData.auth_allowed,
      },
    });

    revalidatePath(path);
    return { success: true, errors };
  } catch (error) {
    handleError(error);
    return {
      success: false,
      errors: [{ field: "unknown", msg: "Une erreur est survenue." }],
    };
  }
}

// UPDATE
export async function updateUser({
  id,
  user,
  path,
}: {
  id: number;
  user: Partial<UserFormData>;
  path: string;
}): Promise<{ success: boolean; errors?: { field: string; msg: string }[] }> {
  try {
    const validatedData = userFormSchema.partial().parse(user);
    const success = false;
    const errors: { field: string; msg: string }[] = [];

    const exists = await prisma.user.findFirst({
      where: {
        AND: [
          {
            OR: [
              { email: validatedData.email },
              { username: validatedData.username },
            ],
          },
          { NOT: { id: Number(id) } },
        ],
      },
    });

    if (exists?.email === validatedData.email) {
      errors.push({
        field: "email",
        msg: "Cet email est déjà utilisé.",
      });
    }
    if (exists?.username === validatedData.username) {
      errors.push({
        field: "username",
        msg: "Ce nom d'utilisateur est déjà utilisé.",
      });
    }
    if (errors.length > 0) {
      return { success, errors };
    }
    if (validatedData.person_id) {
      await prisma.person.update({
        where: { id: validatedData.person_id },
        data: {
          firstname: validatedData.firstname,
          lastname: validatedData.lastname,
          phone_number: validatedData.phone_number,
          address: validatedData.address,
          gender: validatedData.gender,
          date_of_birth: validatedData.date_of_birth,
        },
      });
    }

    if (validatedData.password) {
      const password = await hashPassword(validatedData.password);
      await prisma.user.update({
        where: { id: Number(id) },
        data: {
          username: validatedData.username,
          email: validatedData.email,
          password: password,
          role_id: validatedData.role_id,
          auth_allowed: validatedData.auth_allowed,
        },
      });
    }

    await prisma.user.update({
      where: { id: Number(id) },
      data: {
        username: validatedData.username,
        email: validatedData.email,
        role_id: validatedData.role_id,
        auth_allowed: validatedData.auth_allowed,
      },
    });

    revalidatePath(path);
    return { success: true, errors };
  } catch (error) {
    handleError(error);
    return {
      success: false,
      errors: [{ field: "unknown", msg: "Une erreur est survenue." }],
    };
  }
}

// DELETE
export async function deleteUser(id: number, path: string) {
  try {
    const deletedUser = await prisma.user.update({
      where: { id },
      data: { soft_delete: true },
    });
    revalidatePath(path);
    return JSON.parse(JSON.stringify(deletedUser));
  } catch (error) {
    handleError(error);
  }
}

// TOGGLE AUTH
export async function toggleUserAuth(id: number, value: boolean, path: string) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { auth_allowed: value },
    });
    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedUser)) as IUser;
  } catch (error) {
    handleError(error);
  }
}
// GET ALL USERS
export async function getAllUsers({
  page = 1,
  limit = 10,
  lastnameOrFistname,
}: {
  page?: number;
  limit?: number;
  lastnameOrFistname?: string;
}): Promise<
  | {
      data: IUser[];
      total: number;
      page: number;
      totalPages: number;
    }
  | undefined
> {
  try {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      await prisma.user.findMany({
        where: {
          soft_delete: false,
          person: {
            OR: [
              {
                firstname: {
                  contains: lastnameOrFistname?.toLowerCase(),
                },
              },
              {
                lastname: {
                  contains: lastnameOrFistname?.toLowerCase(),
                },
              },
            ],
          },
        },
        include: {
          role: true,
          person: true,
        },
        orderBy: {
          person: {
            created_at: "desc",
          },
        },
        skip,
        take: limit,
      }),
      await prisma.user.count({
        where: {
          person: {
            OR: [
              {
                firstname: {
                  contains: lastnameOrFistname?.toLowerCase(),
                },
              },
              {
                lastname: {
                  contains: lastnameOrFistname?.toLowerCase(),
                },
              },
            ],
          },
        },
      }),
    ]);

    return {
      data: users as IUser[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
// GET USER BY ID
export async function getUserById(id: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
        person: true,
      },
    });
    return JSON.parse(JSON.stringify(user)) as IUser;
  } catch (error) {
    handleError(error);
  }
}
export async function getUserEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return JSON.parse(JSON.stringify(user)) as IUser;
  } catch (error) {
    handleError(error);
  }
}
