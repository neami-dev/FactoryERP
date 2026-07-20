"use server";

import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { handleError } from "@/lib/utils";
import { z } from "zod";
import { receptionWrappingSchema } from "../validator";

export type ReceptionWrappingFormData = z.infer<typeof receptionWrappingSchema>;

// CREATE
export async function createReceptionWrapping({
  receptionWrapping,
  path,
}: {
  receptionWrapping: ReceptionWrappingFormData;
  path: string;
}) {
  try {
    const validatedData = receptionWrappingSchema.parse(receptionWrapping);

    const newLink = await prisma.reception_wrapping.create({
      data: validatedData,
      include: {
        reception: true,
        wrapping: true,
      },
    });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(newLink));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteReceptionWrapping({
  id,
  path,
}: {
  id: number;
  path: string;
}) {
  try {
    await prisma.reception_wrapping.delete({
      where: { id },
    });
    revalidatePath(path);
    return { success: true };
  } catch (error) {
    handleError(error);
  }
}
// delete by reception id
export async function deleteReceptionWrappingByReceptionId({
  receptionId,
  path,
}: {
  receptionId: number;
  path: string;
}) {
  try {
    await prisma.reception_wrapping.deleteMany({
      where: { reception_id: receptionId },
    });
    revalidatePath(path);
    return { success: true };
  } catch (error) {
    handleError(error);
  }
}

// GET ALL
export async function getAllReceptionWrappings() {
  try {
    const links = await prisma.reception_wrapping.findMany({
      include: {
        reception: true,
        wrapping: true,
      },
      orderBy: {
        id: "desc",
      },
    });
    return JSON.parse(JSON.stringify(links));
  } catch (error) {
    handleError(error);
  }
}

// GET BY RECEPTION ID
export async function getReceptionWrappingsByReception(receptionId: number) {
  try {
    const links = await prisma.reception_wrapping.findMany({
      where: {
        reception_id: Number(receptionId),
      },
      include: {
        wrapping: true,
        reception: true,
      },
    });
    return JSON.parse(JSON.stringify(links));
  } catch (error) {
    handleError(error);
  }
}

export async function checkWrappingToFinish(wrappingId: number) {
  try {
    const links = await prisma.reception_wrapping.findMany({
      where: {
        wrapping_id: Number(wrappingId),
        reception: {
          OR: [
            { is_wrapped: true },
            {
              weight_taken_in_wrapping: { gt: 0 },
            },
          ],
        },
      },
      include: {
        reception: true,
      },
    });

    return { data: JSON.parse(JSON.stringify(links)) };
  } catch (error) {
    handleError(error);
  }
}
