"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { permissionCategoryFormSchema } from "../validator";
import { handleError } from "../utils";

export type PermissionCategoryFormData = z.infer<
  typeof permissionCategoryFormSchema
>;
// CREATE
export async function createPermissionCategory({
  category,
  path,
}: {
  category: PermissionCategoryFormData;
  path: string;
}) {
  try {
    const validated = permissionCategoryFormSchema.parse(category);

    const newCategory = await prisma.permission_category.create({
      data: validated,
    });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    handleError(error);
  }
}

// GET ALL
export async function getAllPermissionCategories() {
  try {
    const categories = await prisma.permission_category.findMany({
      include: {
        permission: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return {
      data: JSON.parse(JSON.stringify(categories)),
    };
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updatePermissionCategory({
  id,
  category,
  path,
}: {
  id: number;
  category: Partial<PermissionCategoryFormData>;
  path: string;
}) {
  try {
    const validated = permissionCategoryFormSchema.partial().parse(category);

    const updated = await prisma.permission_category.update({
      where: { id },
      data: validated,
    });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(updated));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deletePermissionCategory({
  id,
  path,
}: {
  id: number;
  path: string;
}) {
  try {
    const deleted = await prisma.permission_category.delete({
      where: { id },
    });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(deleted));
  } catch (error) {
    handleError(error);
  }
}
