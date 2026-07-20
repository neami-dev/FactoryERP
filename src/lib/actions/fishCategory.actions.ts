"use server";

import { ICategory } from "@/interfaces";
import {
  CreateFishCategoryParams,
  DeleteFishCateoryParams,
  UpdateFishCategoryParams,
} from "@/types";

import { revalidatePath } from "next/cache";
import { buildDateFilter, getRandomColor, handleError } from "../utils";
import { prisma } from "../prisma";
import { categoryFormSchema } from "../validator";

// CREATE
export async function createCategory({
  category,

  path,
}: CreateFishCategoryParams) {
  try {
    const validatedData = await categoryFormSchema.safeParseAsync(category);

    if (validatedData.success) {
      const newCategory = await prisma.fish_category.create({
        data: { ...validatedData.data, img: category.img },
      });
      revalidatePath(path);

      return {
        data: JSON.parse(JSON.stringify(newCategory)) as ICategory,
        error: null,
      };
    } else {
      return {
        data: null,
        error: validatedData.error.flatten().fieldErrors,
      };
    }
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateCategory({
  category,
  path,
}: UpdateFishCategoryParams) {
  const validatedData = await categoryFormSchema
    .partial()
    .safeParseAsync(category);
  try {
    if (!validatedData.success) {
      return {
        data: null,
        error: validatedData?.error.flatten().fieldErrors,
      };
    } else {
      const updatedReception = await prisma.fish_category.update({
        where: { id: category.id },
        data: { ...validatedData.data, img: category.img },
      });
      revalidatePath(path);
      return {
        data: JSON.parse(JSON.stringify(updatedReception)) as ICategory,
        error: null,
      };
    }
  } catch (error) {
    if ((error as { code?: string })?.code === "P2025") {
      throw new Error("Reception not found");
    }
    handleError(error);
  }
}

// GET ALL
export async function getAllCategories() {
  try {
    const categories = await prisma.fish_category.findMany();
    return {
      data: JSON.parse(JSON.stringify(categories)) as ICategory[],
    };
  } catch (error) {
    handleError(error);
  }
}
export async function getAvailableFishCategoriesForShipping(
  shippingId: number
) {
  try {
    const usedCategoryIds = await prisma.shipping_Fish_category.findMany({
      where: { shipping_id: shippingId },
      select: { fish_category_id: true },
    });

    const ids = usedCategoryIds.map((item) => item.fish_category_id);

    const availableCategories = await prisma.fish_category.findMany({
      where: {
        id: {
          notIn: ids.length > 0 ? ids : [0],
        },
      },
    });

    return availableCategories;
  } catch (error) {
    handleError(error);
  }
}

// GET by id
export async function getCategoryById(id: number) {
  try {
    const category = await prisma.fish_category.findUnique({
      where: { id: Number(id) },
      include: {
        weight_type: {
          orderBy: {
            order: "asc",
          },
        },
        wrapping_weight_type: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return {
      data: JSON.parse(JSON.stringify(category)) as ICategory,
    };
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteCategory({ id, path }: DeleteFishCateoryParams) {
  try {
    const updatedReception = await prisma.fish_category.delete({
      where: { id },
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedReception)) as ICategory;
  } catch (error) {
    if ((error as { code?: string })?.code === "P2025") {
      throw new Error("fish category not found");
    }
    handleError(error);
  }
}
export async function categoryNameExists({
  name,
  id,
}: {
  name: string;
  id?: number;
}): Promise<boolean> {
  if (id) {
    const existing = await prisma.fish_category.findUnique({
      where: { name, NOT: { id: Number(id) } },
    });
    return !!existing;
  }
  const existing = await prisma.fish_category.findUnique({
    where: { name },
  });
  return !!existing;
}

export async function isCategoryUsed(id: number): Promise<boolean> {
  const existing = await prisma.reception.findFirst({
    where: { fish_category_id: id },
  });
  return !!existing;
}

export async function getFishCategoryWeights({
  period = "month",
  startDate,
  endDate,
}: {
  period?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<
  | {
      wrapped: {
        name: string;
        value: number;
        color: string;
        percentage: number;
      }[];
      notWrapped: {
        name: string;
        value: number;
        color: string;
        percentage: number;
      }[];
    }
  | undefined
> {
  const now = new Date();
  const dateFilter = buildDateFilter(period, now, startDate, endDate);

  const fishCategories = await prisma.fish_category.findMany({
    include: {
      weight_type: {
        include: {
          reception_weight_fish: {
            include: {
              reception: {
                select: {
                  tare_weight: true,
                  is_wrapped: true,
                  weight_taken_in_wrapping: true,
                  created_at: true,
                },
              },
            },
          },
        },
      },
    },
  });

  function computeWeight(filterWrapped: boolean): {
    name: string;
    value: number;
    color: string;
  }[] {
    return fishCategories.map((category) => {
      const totalWeight = category.weight_type.reduce((sum, wt) => {
        const wtSum = wt.reception_weight_fish
          .filter((rwf) => {
            const r = rwf.reception;
            const isWrapped = r?.is_wrapped ?? false;
            const isNotWrapped =
              !isWrapped &&
              (r?.weight_taken_in_wrapping === 0 ||
                r?.weight_taken_in_wrapping === null);

            const inDateRange =
              rwf.created_at >= dateFilter.gte &&
              rwf.created_at <= dateFilter.lte;

            return (
              inDateRange &&
              (filterWrapped
                ? isWrapped || (r?.weight_taken_in_wrapping ?? 0) > 0
                : isNotWrapped)
            );
          })

          .reduce((innerSum, rwf) => {
            const tare = rwf.reception?.tare_weight ?? 0;
            const net = rwf.weight - rwf.crate * tare;
            return innerSum + net;
          }, 0);

        return sum + wtSum;
      }, 0);

      return {
        name: category.name,
        value: totalWeight,
        color: getRandomColor(),
      };
    });
  }

  const wrappedWeights = computeWeight(true);
  const notWrappedWeights = computeWeight(false);

  const totalWrapped = wrappedWeights.reduce((sum, c) => sum + c.value, 0);
  const totalNotWrapped = notWrappedWeights.reduce(
    (sum, c) => sum + c.value,
    0
  );

  const wrapped = wrappedWeights.map((cat) => ({
    ...cat,
    percentage: totalWrapped
      ? parseFloat(((cat.value / totalWrapped) * 100).toFixed(2))
      : 0,
  }));

  const notWrapped = notWrappedWeights.map((cat) => ({
    ...cat,
    percentage: totalNotWrapped
      ? parseFloat(((cat.value / totalNotWrapped) * 100).toFixed(2))
      : 0,
  }));

  return { wrapped, notWrapped };
}

export async function getCategoriesInfos() {}
