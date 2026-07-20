"use server";

import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { handleError } from "@/lib/utils";
import { shippingWeightFishSchema } from "../validator";
import { IShippingWeightFish } from "@/interfaces";

export type ShippingWeightFishFormData = z.infer<
  typeof shippingWeightFishSchema
>;

// CREATE
export async function createShippingWeightFish({
  data,
  shipping_fish_category_id,
  paths,
}: {
  data: ShippingWeightFishFormData;
  shipping_fish_category_id: number;
  paths: string[];
}) {
  try {
    const validated = shippingWeightFishSchema.parse(data);
    if (!validated?.pallet_id) {
      return;
    }

    const item = await prisma.shipping_weight_fish.create({
      data: {
        ...validated,
        shipping_Fish_category_id: Number(shipping_fish_category_id),
        weight: Number(validated.weight),
        pallet_id: Number(validated.pallet_id),
      },
      include: {
        wrapping_weight_type: true,
      },
    });

    paths.forEach((path) => revalidatePath(path));

    return JSON.parse(JSON.stringify(item));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateShippingWeightFish({
  id,
  data,
  path,
}: {
  id: number;
  data: Partial<ShippingWeightFishFormData>;
  path: string;
}) {
  try {
    const validated = shippingWeightFishSchema.partial().parse(data);
 

    const item = await prisma.shipping_weight_fish.update({
      where: { id: Number(id) },
      data: { ...validated, weight: Number(validated.weight) },
    });
    revalidatePath(path);
    return JSON.parse(JSON.stringify(item));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteShippingWeightFish({
  id,
  path,
}: {
  id: number;
  path: string;
}) {
  try {
    const item = await prisma.shipping_weight_fish.delete({
      where: { id },
    });
    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error) {
    handleError(error);
  }
}

// GET BY Shipping_Fish_category ID
export async function getShippingWeightFishByShippingCategory(
  shippingFishCategoryId: number
) {
  try {
    const list = await prisma.shipping_weight_fish.findMany({
      where: { shipping_Fish_category_id: shippingFishCategoryId },
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

export async function getLastShippingWeightFish(
  shippingFishCategoryId: number
) {
  try {
    const latest = await prisma.shipping_weight_fish.findFirst({
      where: { shipping_Fish_category_id: Number(shippingFishCategoryId) },
      orderBy: { created_at: "desc" },
      include: { wrapping_weight_type: true, pallet: true, quality: true },
    });
    return { data: JSON.parse(JSON.stringify(latest)) as IShippingWeightFish };
  } catch (error) {
    handleError(error);
  }
}

export async function getShippingWeightFish(id: number) {
  try {
    const item = await prisma.shipping_weight_fish.findUnique({
      where: { id: Number(id) },
      include: {
        quality: true,
        shipping_Fish_category: true,
        wrapping_weight_type: true,
        pallet: true,
      },
    });
    return JSON.parse(JSON.stringify(item)) as IShippingWeightFish;
  } catch (error) {
    handleError(error);
  }
}
