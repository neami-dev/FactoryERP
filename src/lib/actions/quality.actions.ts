"use server";

import { prisma } from "../prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { handleError } from "@/lib/utils";
import { IQuality } from "@/interfaces";
import { qualitySchema } from "../validator";

export type QualityFormData = z.infer<typeof qualitySchema>;

// CREATE
export async function createQuality({
  data,
  path,
}: {
  data: QualityFormData;
  path: string;
}) {
  try {
    const validated = qualitySchema.parse(data);
    const quality = await prisma.quality.create({
      data: validated,
    });
    revalidatePath(path);
    return quality;
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateQuality({
  data,
  path,
}: {
  data: Partial<QualityFormData>;
  path: string;
}) {
  try {
    if (!data.id) return;
    const validated = qualitySchema.partial().parse(data);
    const updated = await prisma.quality.update({
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
export async function getQualityById(id: number) {
  try {
    const quality = await prisma.quality.findUnique({
      where: { id },
    });
    return quality;
  } catch (error) {
    handleError(error);
  }
}

// GET ALL
export async function getAllQualities() {
  try {
    const qualities = await prisma.quality.findMany({
      orderBy: { created_at: "desc" },
    });
    return JSON.parse(JSON.stringify(qualities)) as IQuality[];
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteQuality({
  id,
  path,
}: {
  id: number;
  path: string;
}) {
  try {
    const isInReceptionWeighFish = await prisma.reception_weight_fish.findFirst(
      {
        where: { quality_id: Number(id) },
      }
    );
    const isInWrappingWeighFish = await prisma.wrapping_weight_fish.findFirst({
      where: { quality_id: Number(id) },
    });
    const isInShippingWeightFish = await prisma.shipping_weight_fish.findFirst({
      where: { quality_id: Number(id) },
    });
    if (
      isInReceptionWeighFish ||
      isInWrappingWeighFish ||
      isInShippingWeightFish
    ) {
      return {
        success: false,
        message: "La qualité est utilisée dans un autre processus.",
      };
    }
    await prisma.quality.delete({
      where: { id: Number(id) },
    });
    revalidatePath(path);
    return { success: true, message: "Qualité supprimée avec succès." };
  } catch (error) {
    handleError(error);
  }
}
