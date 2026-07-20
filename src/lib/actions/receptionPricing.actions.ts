"use server";
import { revalidatePath } from "next/cache";
import { handleError } from "../utils";
import { CreatereceptionPrice } from "@/types";
import { prisma } from "../prisma";
import {
  receptionPriceFormSchema,
  validateReceptionId,
  validateWieghtTypeId,
} from "../validator";

export async function createReceptionPrice({
  reception_price,
  reception_id,
  weight_type_name,
  path,
}: CreatereceptionPrice) {
  try {
    const receptionId = validateReceptionId.parse(reception_id);
    const weightTypeName = validateWieghtTypeId.parse(weight_type_name);
    const validatedData = receptionPriceFormSchema.parse(reception_price);

    const newReceptionPrice = await prisma.reception_pricing.upsert({
      where: {
        reception_id_weight_type_name: {
          reception_id: receptionId,
          weight_type_name: weightTypeName,
        },
      },
      update: {
        ...validatedData,
      },
      create: {
        ...validatedData,
        reception_id: receptionId,
        weight_type_name: weightTypeName,
      },
    });
    revalidatePath(path);

    return JSON.parse(JSON.stringify(newReceptionPrice));
  } catch (error) {
    handleError(error);
  }
}

export async function getDefaultPrice({
  reception_id,
  weight_type_name,
}: {
  reception_id: number;
  weight_type_name: string;
}) {
  try {
    const receptionId = validateReceptionId.parse(reception_id);
    const weightTypeName = validateWieghtTypeId.parse(weight_type_name); 

    const response = await prisma.reception_pricing.findFirst({
      where: {
        reception_id: receptionId,
        weight_type_name: weightTypeName,
      },
      select: {
        price_kg: true,
      },
    });

    return (
      (JSON.parse(JSON.stringify(response)) as { price_kg: number }) || null
    );
  } catch (error) {
    handleError(error);
  }
}

export async function deleteReceptionPrice({
  reception_id,
  weight_type_name,
  path,
}: {
  reception_id: number;
  weight_type_name: string;
  path: string;
}) {
  try {
    const receptionId = validateReceptionId.parse(reception_id);
    const weightTypeName = validateWieghtTypeId.parse(weight_type_name);

    const response = await prisma.reception_pricing.delete({
      where: {
        reception_id_weight_type_name: {
          reception_id: receptionId,
          weight_type_name: weightTypeName,
        },
      },
    });
    revalidatePath(path);
    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    handleError(error);
  }
}
