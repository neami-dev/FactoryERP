"use server";

import { revalidatePath } from "next/cache";
import { buildDateFilter, getRandomColor, handleError } from "../utils";
import { CreateReceptionWFParams, UpdateReceptionWFParams } from "@/types";
import { IReceptionWeightFish } from "@/interfaces";
import { prisma } from "../prisma";
import { receptionWFFormSchema } from "../validator";
import { getTotalWeightTracByReception } from "./invoice.actions";
import { groupBy } from "lodash";

// CREATE
export async function createReceptionWeightFish({
  reception_id,
  reception_weight_fish,
  paths,
}: CreateReceptionWFParams) {
  const validatedData = receptionWFFormSchema.parse(reception_weight_fish);
  try {
    const newReceptionWF = await prisma.reception_weight_fish.create({
      data: {
        ...validatedData,
        weight: Number(validatedData.weight),
        reception_id: Number(reception_id),
      },
    });

    paths.forEach((path) => {
      revalidatePath(path);
    });

    return JSON.parse(JSON.stringify(newReceptionWF)) as IReceptionWeightFish;
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateReceptionWeightFish({
  reception_weight_fish,
  path,
}: UpdateReceptionWFParams) {
  const validatedData = receptionWFFormSchema.parse(reception_weight_fish);
  try {
    const updatedReceptionWF = await prisma.reception_weight_fish.update({
      where: {
        id: reception_weight_fish.id,
      },
      data: {
        ...validatedData,
        weight: Number(validatedData.weight),
      },
    });

    revalidatePath(path);

    return JSON.parse(
      JSON.stringify(updatedReceptionWF)
    ) as IReceptionWeightFish;
  } catch (error) {
    handleError(error);
  }
}

//  GET BY ID
export async function getReceptionWFById(id: number) {
  try {
    const reception = await prisma.reception_weight_fish.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        reception: true,
      },
    });

    return {
      data: JSON.parse(JSON.stringify(reception)) as IReceptionWeightFish,
    };
  } catch (error) {
    handleError(error);
  }
}
// GET ALL
export async function getAllReceptionWF() {
  try {
    const categories = await prisma.reception_weight_fish.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    return {
      data: JSON.parse(JSON.stringify(categories)) as IReceptionWeightFish[],
    };
  } catch (error) {
    handleError(error);
  }
}
export async function getRWFByReceptionFish(receptionId: number) {
  try {
    const categories = await prisma.reception_weight_fish.findMany({
      where: { reception_id: Number(receptionId) },
      orderBy: {
        created_at: "desc",
      },
      include: {
        weight_type: true,
      },
    });

    return {
      data: JSON.parse(JSON.stringify(categories)) as IReceptionWeightFish[],
    };
  } catch (error) {
    handleError(error);
  }
}

export async function getLastReceptionWeightFish(receptionId: number) {
  try {
    const response = await prisma.reception_weight_fish.findFirst({
      where: { reception_id: Number(receptionId) },
      orderBy: {
        created_at: "desc",
      },
      include: {
        weight_type: true,
      },
    });

    return {
      data: JSON.parse(JSON.stringify(response)) as IReceptionWeightFish,
    };
  } catch (error) {
    handleError(error);
  }
}
// DELETE
export default async function deleteRepetionWeightFish({
  id,
  path,
}: {
  id: number;
  path: string;
}) {
  try {
    const response = await prisma.reception_weight_fish.delete({
      where: {
        id: Number(id),
      },
    });
    revalidatePath(path);
    return {
      success: true,
      message: "Item deleted successfully",
      data: JSON.parse(JSON.stringify(response)),
    };
  } catch (error) {
    handleError(error);
  }
}

export async function getGroupedWeightTypes(receptionId: number) {
  try {
    const [reception, receptionWeightFish, receptionPrice, totalWeightTrace] =
      await Promise.all([
        // get reception
        prisma.reception.findUnique({
          where: {
            id: Number(receptionId),
          },
        }),

        // get reception weight fish
        prisma.reception_weight_fish.findMany({
          where: {
            reception_id: Number(receptionId),
          },
          include: {
            weight_type: true,
          },
          orderBy: {
            weight_type: {
              order: "asc",
            },
          },
        }),

        // get reception price
        prisma.reception_pricing.findMany({
          where: {
            reception_id: Number(receptionId),
          },
        }),
        // total weight of tracability
        getTotalWeightTracByReception(receptionId),
      ]);
    const totalWeight = receptionWeightFish.reduce(
      (sum, item) => sum + item.weight,
      0
    );
    const totalCrate = receptionWeightFish.reduce(
      (sum, item) => sum + item.crate,
      0
    );
    const totalWeightNet =
      totalWeight - totalCrate * (reception?.tare_weight ?? 0);

    const grouped = groupBy(
      receptionWeightFish,
      (item) => item.weight_type.name
    );

    const totalWeightsByType = Object.entries(grouped).map(([type, items]) => {
      const totalWeight = items?.reduce((sum, item) => sum + item.weight, 0);
      const totalCrate = items?.reduce((sum, item) => sum + item.crate, 0);
      const netWeight =
        (totalWeight || 0) - (totalCrate || 0) * (reception?.tare_weight ?? 0);

      const filteredPrice = receptionPrice.filter(
        (item) => item.weight_type_name === type
      );

      return {
        type,
        totalWeight,
        totalCrate,
        netWeight,
        price: (filteredPrice[0]?.price_kg ?? 0) * netWeight,
      };
    });

    const totalPrice = totalWeightsByType.reduce(
      (sum, item) => sum + item.price,
      0
    );
    const deffBetweenTracAndRes: number =
      (totalWeightTrace ?? 0) - totalWeightNet;

    const finalPrice: number =
      totalPrice + (reception?.untraced_price_kg ?? 0) * deffBetweenTracAndRes;

    return {
      grouped,
      totalWeightsByType,
      totalWeightNet,
      totalPrice,
      finalPrice,
    };
  } catch (error) {
    handleError(error);
  }
}

export async function getWeightsByTypesAndreception({
  receptionId,
  type,
}: {
  receptionId: number;
  type: string;
}) {
  try {
    const response = await prisma.reception_weight_fish.findMany({
      where: {
        reception_id: Number(receptionId),
        weight_type: {
          name: type,
        },
      },
    });

    return response as IReceptionWeightFish[];
  } catch (error) {
    handleError(error);
  }
}

export async function getCategoryWeightTypeStatsRes({
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
      weight_type: {
        include: {
          reception_weight_fish: {
            where: {
              created_at: {
                gte: dateFilter.gte,
                lte: dateFilter.lte,
              },
              reception: {
                is_wrapped: false,
                OR: [
                  { weight_taken_in_wrapping: 0 },
                  { weight_taken_in_wrapping: null },
                ],
              },
            },
            include: {
              reception: {
                select: {
                  tare_weight: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const result = fishCategories.map((category) => {
    const types = category.weight_type.map((type) => {
      const total = type.reception_weight_fish.reduce((sum, rwf) => {
        const tare = rwf.reception?.tare_weight ?? 0;
        const net = rwf.weight - rwf.crate * tare;
        return sum + net;
      }, 0);
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
