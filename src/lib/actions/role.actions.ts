"use server";

import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { handleError } from "../utils";

import { IRole } from "@/interfaces";
import { z } from "zod";
import { roleFormSchema } from "../validator";
export type RoleFormData = z.infer<typeof roleFormSchema>;

// CREATE
export async function createRole({
  role,
  permissions_id,
  path,
}: {
  role: RoleFormData;
  permissions_id: number[];
  path: string;
}) {
  try {
    const validatedData = roleFormSchema.parse(role);
    const newRole = await prisma.role.create({
      data: {
        ...validatedData,
        ...(permissions_id &&
          permissions_id.length > 0 && {
            permissions: {
              connect: permissions_id.map((id) => ({ id })),
            },
          }),
      },
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newRole)) as IRole;
  } catch (error) {
    handleError(error);
  }
}

// READ ALL
export async function getAllRoles() {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: true,
      },
    });

    return {
      data: JSON.parse(JSON.stringify(roles)) as IRole[],
    };
  } catch (error) {
    handleError(error);
  }
}

// READ ONE
export async function getRoleById(id: number) {
  try {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: true,
      },
    });

    return role ? (JSON.parse(JSON.stringify(role)) as IRole) : null;
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateRole({
  id,
  role,
  permissions_id,
  path,
}: {
  id: number;
  role: Partial<RoleFormData>;
  permissions_id: number[];
  path: string;
}) {
  try {
    const validatedData = roleFormSchema.partial().parse(role);

    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        ...validatedData,
        ...(permissions_id && {
          permissions: {
            set: permissions_id.map((id) => ({ id })),
          },
        }),
      },
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedRole)) as IRole;
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteRole(id: number, path: string) {
  try {
    const ifUsed = await prisma.user.findFirst({
      where: { role_id: Number(id) },
    });
    if (ifUsed) return null;
    const deletedRole = await prisma.role.delete({
      where: { id: Number(id) },
    });

    revalidatePath(path);

    return deletedRole;
  } catch (error) {
    handleError(error);
  }
}

export async function getUsedRoles() {
  try {
    const usedRoles = await prisma.role.findMany({
      where: {
        users: {
          some: {},
        },
      },
      select: {
        id: true,
        name: true,
        users: {
          select: { id: true },
        },
      },
    });

    return usedRoles;
  } catch (error) {
    handleError(error);
  }
}
