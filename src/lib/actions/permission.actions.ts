"use server";
import { z } from "zod";
import { permissionFormSchema } from "../validator";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { handleError } from "../utils";
import { IPermission } from "@/interfaces";

export type PermissionFormData = z.infer<typeof permissionFormSchema>;

// CREATE
export async function createPermission({
  permission,
  path,
}: {
  permission: PermissionFormData;
  path: string;
}) {
  try {
    const validated = permissionFormSchema.parse(permission);

    const newPermission = await prisma.permission.create({
      data: validated,
    });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(newPermission));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updatePermission({
  id,
  permission,
  path,
}: {
  id: number;
  permission: Partial<PermissionFormData>;
  path: string;
}) {
  try {
    const validated = permissionFormSchema.partial().parse(permission);

    const updated = await prisma.permission.update({
      where: { id: Number(id) },
      data: validated,
    });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(updated));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deletePermission({
  id,
  path,
}: {
  id: number;
  path: string;
}) {
  try {
    const deleted = await prisma.permission.delete({
      where: { id: Number(id) },
    });
    revalidatePath(path);
    return JSON.parse(JSON.stringify(deleted));
  } catch (error) {
    handleError(error);
  }
}
export async function getPermissionsByUserId(userId: number) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
    
     return {
      data: JSON.parse(JSON.stringify(user?.role.permissions)) as IPermission[],
    };
  } catch (error) {
    handleError(error);
  }
}
// GET ALL
export async function getAllPermissions() {
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: {
        created_at: "desc",
      },
      include: {
        category: true,
      },
    });

    return {
      data: JSON.parse(JSON.stringify(permissions)) as IPermission[],
    };
  } catch (error) {
    handleError(error);
  }
}
