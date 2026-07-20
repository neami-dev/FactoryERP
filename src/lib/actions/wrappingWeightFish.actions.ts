"use server";
import groupBy from 'lodash/groupBy';
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { buildDateFilter, getRandomColor, handleError } from "@/lib/utils";
import { z } from "zod";
import { validateWrappingId, wrappingWeightFishSchema } from "../validator";
import { IWrappingWeightFish } from "@/interfaces";

export type WrappingWeightFishFormData = z.infer<
  typeof wrappingWeightFishSchema
>;

// CREATE
export async function createWrappingWeightFish({
  data,
  wrappingId,
  paths,
}: {
  data: WrappingWeightFishFormData;
  wrappingId: number;
  paths: string[];
}) {
  try {
    const validated = wrappingWeightFishSchema.parse(data);
    const validatedWrappingId = validateWrappingId.parse(wrappingId);
    const newItem = await prisma.wrapping_weight_fish.create({
      data: {
        ...validated,
        weight: Number(validated.weight),
        wrapping_id: Number(validatedWrappingId),
        wrapping_weight_type_id: Number(validated.wrapping_weight_type_id),
      },
      include: {
        wrapping_weight_type: true,
      },
    });
    paths.forEach((path) => revalidatePath(path));
    return JSON.parse(JSON.stringify(newItem));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateWrappingWeightFish({
  id,
  data,
  wrappingId,
  paths,
}: {
  id: number;
  data: Partial<WrappingWeightFishFormData>;
  wrappingId: number;
  paths: string[];
}) {
  try {
    const validated = wrappingWeightFishSchema.partial().parse(data);
    const validatedWrappingId = validateWrappingId.parse(wrappingId);
    const updated = await prisma.wrapping_weight_fish.update({
      where: { id },
      data: {
        ...validated,
        weight: Number(validated.weight),
        wrapping_id: Number(validatedWrappingId),
        wrapping_weight_type_id: Number(validated.wrapping_weight_type_id),
      },
    });
    paths.forEach((path) => revalidatePath(path));
    return JSON.parse(JSON.stringify(updated));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteWrappingWeightFish({
  id,
  path,
}: {
  id: number;
  path: string;
}) {
  try {
    const deleted = await prisma.wrapping_weight_fish.delete({
      where: { id },
    });
    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(deleted)) };
  } catch (error) {
    handleError(error);
  }
}

// GET BY WRAPPING ID
export async function getWrappingWeightFishByWrapping(wrappingId: number) {
  try {
    const list = await prisma.wrapping_weight_fish.findMany({
      where: { wrapping_id: wrappingId },
      include: {
        wrapping_weight_type: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return JSON.parse(JSON.stringify(list));
  } catch (error) {
    handleError(error);
  }
}
export async function getWWFByWrappingFish(wrappingId: number) {
  try {
    const wrappingFeightFish = await prisma.wrapping_weight_fish.findMany({
      where: { wrapping_id: Number(wrappingId) },
      orderBy: {
        created_at: "desc",
      },
      include: {
        wrapping_weight_type: true,
      },
    });

    return {
      data: JSON.parse(
        JSON.stringify(wrappingFeightFish)
      ) as IWrappingWeightFish[],
    };
  } catch (error) {
    handleError(error);
  }
}
// GET ALL
export async function getAllWrappingWeightFish() {
  try {
    const list = await prisma.wrapping_weight_fish.findMany({
      include: {
        wrapping: true,
        wrapping_weight_type: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return JSON.parse(JSON.stringify(list));
  } catch (error) {
    handleError(error);
  }
}
export async function getWeightsByTypesAndWrapping({
  wrappingId,
  type,
}: {
  wrappingId: number;
  type: string;
}) {
  try {
    const response = await prisma.wrapping_weight_fish.findMany({
      where: {
        wrapping_id: Number(wrappingId),
        wrapping_weight_type: {
          name: type,
        },
      },
    });
  
    return response as IWrappingWeightFish[];
  } catch (error) {
    handleError(error);
  }
}
export async function getWrappingWFById(id: number) {
  try {
    const item = await prisma.wrapping_weight_fish.findUnique({
      where: { id: Number(id) },
      include: {
        wrapping: true,
        wrapping_weight_type: true,
      },
    });
    return { data: JSON.parse(JSON.stringify(item)) as IWrappingWeightFish };
  } catch (error) {
    handleError(error);
  }
}
export async function getLastWrappingWeightFish(wrappingId: number) {
  try {
    const latest = await prisma.wrapping_weight_fish.findFirst({
      where: { wrapping_id: Number(wrappingId) },
      orderBy: { created_at: "desc" },
      include: { wrapping_weight_type: true },
    });
    return { data: JSON.parse(JSON.stringify(latest)) as IWrappingWeightFish };
  } catch (error) {
    handleError(error);
  }
}

export async function getGroupedWeightTypesWrapping(wrappingId: number) {
  try {
    const wrappingWeightFish = await prisma.wrapping_weight_fish.findMany({
      where: {
        wrapping_id: Number(wrappingId),
      },
      include: {
        wrapping_weight_type: true,
      },
      orderBy: {
        wrapping_weight_type: {
          order: "asc",
        },
      },
    });
    const totalWeight = wrappingWeightFish.reduce(
      (sum, item) => sum + item.weight,
      0
    );
    const totalBox = wrappingWeightFish.reduce(
      (sum, item) => sum + item.box,
      0
    );
    const grouped = groupBy(
      wrappingWeightFish,
      (item) => item.wrapping_weight_type.name
    );

    const totalWeightsByType = Object.entries(grouped).map(([type, items]) => {
      const totalWeight = items?.reduce((sum, item) => sum + item.weight, 0);
      const totalCrate = items?.reduce((sum, item) => sum + item.box, 0);

      return {
        type,
        totalWeight,
        totalCrate,
      };
    });
    return {
      grouped,
      totalWeight,
      totalBox,
      totalWeightsByType,
    };
  } catch (error) {
    handleError(error);
  }
}

export async function getCategoryWeightTypeStatsWrap({
  period = "month",
  startDate,
  endDate,
}: {
  period?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  const now = new Date();
  const dateFilter = buildDateFilter(period, now, startDate, endDate);

  const fishCategories = await prisma.fish_category.findMany({
    include: {
      wrapping_weight_type: {
        include: {
          wrapping_weight_fish: {
            where: {
              created_at: {
                gte: dateFilter.gte,
                lte: dateFilter.lte,
              },
            },
          },
        },
      },
    },
  });

  const result = fishCategories.map((category) => {
    const types = category.wrapping_weight_type.map((type) => {
      const total = type.wrapping_weight_fish.reduce(
        (sum, rwf) => sum + rwf.weight,
        0
      );
      return {
        type: type.name,
        totalWeight: total,
        color: getRandomColor(),
      };
    });

    return {
      category: category.name,
      types,
    };
  });

  return result;
}
