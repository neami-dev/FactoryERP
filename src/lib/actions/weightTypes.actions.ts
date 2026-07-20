"use server";

import { CreateWeightTypeParams, UpdateWeightTypeParams } from "@/types";
import { prisma } from "../prisma";
import { handleError } from "../utils";
import { IWeightType } from "@/interfaces";
import { weightTypeSchema } from "../validator";
import { revalidatePath } from "next/cache";

export async function weightTpeExists({
  name,
  categroyId,
}: {
  name: string;
  categroyId: number;
}) {
  const existingWeightType = await prisma.weight_type.findUnique({
    where: {
      fish_category_id_name: {
        fish_category_id: Number(categroyId),
        name,
      },
    },
  });
  return !!existingWeightType;
}
// CREATE
export async function createWeightType({
  weighType,
  fish_category_id,
  path,
}: CreateWeightTypeParams) {
  const validatedData = weightTypeSchema.parse(weighType);
  try {
    const lastOrder = await prisma.weight_type.findFirst({
      where: { fish_category_id },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const nextOrder = lastOrder?.order ? lastOrder.order + 1 : 1;

    const newWeightType = await prisma.weight_type.create({
      data: {
        ...validatedData,
        order: nextOrder,
        fish_category_id: Number(fish_category_id),
      },
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newWeightType));
  } catch (error) {
    handleError(error);
  }
}
// UPDATE ORDERS
export async function updateWeightTypeOrder(
  items: { id: number; order: number }[]
) {
  try {
    const updates = items.map((item) =>
      prisma.weight_type.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    );

    await prisma.$transaction(updates);
  } catch (error) {
    handleError(error);
  }
}
// UPDATE
export async function updateWeightType({
  weighType,
  path,
}: UpdateWeightTypeParams) {
  try {
    const updatedWeightType = await prisma.weight_type.update({
      where: { id: weighType.id },
      data: { ...weighType },
    });
    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedWeightType));
  } catch (error) {
    handleError(error);
  }
}
//  DELETE
export async function deleteWeighttype(id: number) {
  try {
    const deleted = await prisma.weight_type.delete({
      where: { id },
    });
    return {
      success: true,
      data: JSON.parse(JSON.stringify(deleted)),
    };
  } catch (error) {
    handleError(error);
  }
}
export async function isWeightFishUsed(id: number): Promise<boolean> {
  const existing = await prisma.reception_weight_fish.findFirst({
    where: { weight_type_id: id },
  });
  return !!existing;
}
export async function getWeightTypesByCategory(categoryId: number) {
  try {
    const weightTypes = await prisma.weight_type.findMany({
      where: {
        fish_category_id: Number(categoryId),
      },
    });

    return {
      data: JSON.parse(JSON.stringify(weightTypes)) as IWeightType[],
    };
  } catch (error) {
    handleError(error);
  }
}
