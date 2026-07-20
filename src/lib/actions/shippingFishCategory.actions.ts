"use server";

import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { handleError } from "@/lib/utils";
import { shippingFishCategorySchema } from "../validator";
import { IShippingFishCategory } from "@/interfaces";

export type ShippingFishCategoryFormData = z.infer<
  typeof shippingFishCategorySchema
>;

// CREATE
export async function createShippingFishCategory({
  data,
  path,
}: {
  data: ShippingFishCategoryFormData;
  path: string;
}) {
  try {
    const validated = shippingFishCategorySchema.parse(data);

    const created = await prisma.shipping_Fish_category.create({
      data: validated,
    });

    revalidatePath(path);
    return created;
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateShippingFishCategory({
  data,
  path,
}: {
  data: Partial<ShippingFishCategoryFormData>;
  path: string;
}) {
  try {
    if (!data.id) return;

    const validated = shippingFishCategorySchema.partial().parse(data);

    const updated = await prisma.shipping_Fish_category.update({
      where: { id: validated.id },
      data: validated,
    });

    revalidatePath(path);
    return updated;
  } catch (error) {
    handleError(error);
  }
}

// GET BY ID
export async function getShippingFishCategoryById(id: number) {
  try {
    const item = await prisma.shipping_Fish_category.findUnique({
      where: { id: Number(id) },
      include: {
        shipping: true,
        fish_category: true,
        shipping_weight_fish: {
          include: {
            wrapping_weight_type: true,
          },
        },
      },
    });

    return JSON.parse(JSON.stringify(item)) as IShippingFishCategory;
  } catch (error) {
    handleError(error);
  }
}

// GET ALL
export async function getAllShippingFishCategories({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) {
  try {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.shipping_Fish_category.findMany({
        skip,
        take: limit,
        orderBy: { id: "desc" },
        include: {
          shipping: true,
          fish_category: true,
        },
      }),
      prisma.shipping_Fish_category.count(),
    ]);

    return {
      data: items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteShippingFishCategory({
  id,
  path,
}: {
  id: number;
  path: string;
}) {
  try {
    await prisma.shipping_Fish_category.delete({
      where: { id },
    });

    revalidatePath(path);
    return { success: true };
  } catch (error) {
    handleError(error);
  }
}

export async function getShippingFishCategoryByThem({
  shippingId,
  categoryId,
}: {
  shippingId: number;
  categoryId: number;
}) {
  try {
    const item = await prisma.shipping_Fish_category.findFirst({
      where: {
        fish_category_id: Number(categoryId),
        shipping_id: Number(shippingId),
      },
    });
    return JSON.parse(JSON.stringify(item)) as IShippingFishCategory;
  } catch (error) {
    handleError(error);
  }
}

export async function changeCategoryFish({
  shippingId,
  categoryId,
}: {
  shippingId: number;
  categoryId: number;
}) {
  try {
    const ifExists = await getShippingFishCategoryByThem({
      categoryId,
      shippingId,
    });

    if (!!ifExists) {
      return JSON.parse(JSON.stringify(ifExists)) as IShippingFishCategory;
    }

    const created = await createShippingFishCategory({
      data: {
        fish_category_id: Number(categoryId),
        shipping_id: Number(shippingId),
      },
      path: "",
    });
    return JSON.parse(JSON.stringify(created)) as IShippingFishCategory;
  } catch (error) {
    handleError(error);
  }
}