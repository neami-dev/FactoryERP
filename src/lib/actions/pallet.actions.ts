"use server";

import { prisma } from "../prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { handleError } from "@/lib/utils";
import { palletSchema } from "../validator";
import { IPallet } from "@/interfaces";

export type PalletFormData = z.infer<typeof palletSchema>;

// CREATE
export async function createPalletOrGetLast({
  data,
}: {
  data: PalletFormData;
}) {
  try {
    const validated = palletSchema.parse(data);

    const existingOpenPallet = await prisma.pallet.findFirst({
      where: {
        shipping_id: Number(validated.shipping_id),
        is_closed: false,
      },
      orderBy: {
        pallet_number: "desc",
      },
    });

    if (existingOpenPallet) {
      return JSON.parse(JSON.stringify(existingOpenPallet)) as IPallet;
    }

    const lastPallet = await prisma.pallet.findFirst({
      where: { shipping_id: validated.shipping_id },
      orderBy: { pallet_number: "desc" },
    });

    const nextNumber = (lastPallet?.pallet_number || 0) + 1;

    const created = await prisma.pallet.create({
      data: {
        shipping_id: validated.shipping_id,
        pallet_number: nextNumber,
      },
    });

    return JSON.parse(JSON.stringify(created)) as IPallet;
  } catch (error) {
    handleError(error);
  }
}
export async function getLastpalletInShipping(shippingId: number) {
  try {
    const lastPallet = await prisma.pallet.findFirst({
      where: { shipping_id: Number(shippingId) },
      orderBy: { pallet_number: "desc" },
    });
    return JSON.parse(JSON.stringify(lastPallet)) as IPallet;
  } catch (error) {
    handleError(error);
  }
}
// UPDATE
export async function updatePallet({
  data,
  path,
}: {
  data: Partial<PalletFormData>;
  path: string;
}) {
  try {
    if (!data.id) return;
    const validated = palletSchema.partial().parse(data);

    const updated = await prisma.pallet.update({
      where: { id: Number(validated.id) },
      data: validated,
    });
    revalidatePath(path);

    return JSON.parse(JSON.stringify(updated)) as IPallet;
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deletePallet({ id, path }: { id: number; path: string }) {
  try {
    await prisma.pallet.delete({ where: { id } });
    revalidatePath(path);
    return { success: true };
  } catch (error) {
    handleError(error);
  }
}

// GET BY ID
export async function getPalletById(id: number) {
  try {
    const pallet = await prisma.pallet.findUnique({
      where: { id },

      include: {
        shipping_weight_fish: {
          include: {
            quality: true,
            wrapping_weight_type: true,
            shipping_Fish_category: {
              include: {
                fish_category: true,
              },
            },
          },
        },
      },
    });

    return JSON.parse(JSON.stringify(pallet)) as IPallet;
  } catch (error) {
    handleError(error);
  }
}

// GET ALL BY SHIPPING
export async function getPalletsByShippingId(shippingId: number) {
  try {
    const pallets = await prisma.pallet.findMany({
      where: { shipping_id: shippingId },
      orderBy: { pallet_number: "asc" },
      include: {
        shipping_weight_fish: true,
      },
    });

    return JSON.parse(JSON.stringify(pallets)) as IPallet[];
  } catch (error) {
    handleError(error);
  }
}

export async function getAllInfoOfPalletsByShipId(shippingId: number) {
  try {
    const pallets = await prisma.pallet.findMany({
      where: { shipping_id: Number(shippingId) },
      orderBy: { created_at: "desc" },
      include: {
        shipping_weight_fish: {
          orderBy: { created_at: "desc" },
          include: {
            quality: true,
            wrapping_weight_type: true,
            shipping_Fish_category: {
              include: {
                fish_category: true,
              },
            },
          },
        },
        shipping: {
          include: {
            shipping_Fish_category: {
              include: {
                fish_category: true,
              },
            },
          },
        },
      },
    });

    return JSON.parse(JSON.stringify(pallets)) as IPallet[];
  } catch (error) {
    handleError(error);
  }
}

export async function palletsNotValidatedInShipping(shippingId: number) {
  try {
    const pallets = await prisma.pallet.findMany({
      where: {
        shipping_id: Number(shippingId),
        OR: [{ is_closed: false }, { is_validated: false }],
      },
      select: {
        id: true,
      },
    });

    const total = await prisma.pallet.count({
      where: {
        shipping_id: Number(shippingId),
      },
    });

    if (pallets.length > 0 || (pallets.length === 0 && total === 0)) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    handleError(error);
  }
}

export async function getTotalWeightAndBoxByPallet() {
  try {
    const pallets = await prisma.pallet.findMany({
      include: {
        shipping_weight_fish: true,
      },
    });

    const palletSummaries = pallets.map((pallet) => {
      const totalWeight = pallet.shipping_weight_fish.reduce(
        (acc, curr) => acc + curr.weight,
        0
      );
      const totalBoxes = pallet.shipping_weight_fish.reduce(
        (acc, curr) => acc + curr.box,
        0
      );
      // const types = pallet.shipping_weight_fish.map(
      //   (weight_fish) => weight_fish.wrapping_type
      // );
    

      return {
        palletNumber: pallet.pallet_number,

        totalWeight,
        totalBoxes,
      };
    });

    return palletSummaries;
  } catch (error) {
    handleError(error);
  }
}

export async function getGroupedWeightsByPallet(shippingId: number) {
  try {
    const pallets = await prisma.pallet.findMany({
      where: { shipping_id: Number(shippingId) },
      include: {
        shipping_weight_fish: {
          include: {
            wrapping_weight_type: true,
          },
        },
      },
      orderBy: { pallet_number: "asc" },
    });

    return pallets.map((pallet) => {
      const groups: Record<string, Record<string, number>> = {};

      for (const item of pallet.shipping_weight_fish) {
        const wrappingType = item.wrapping_type;
        const weightTypeName = item.wrapping_weight_type?.name ?? "Unknown";

        if (!groups[wrappingType]) {
          groups[wrappingType] = {};
        }

        if (!groups[wrappingType][weightTypeName]) {
          groups[wrappingType][weightTypeName] = 0;
        }

        groups[wrappingType][weightTypeName] += item.weight;
      }

      return {
        palletNumber: pallet.pallet_number,
        groups,
      };
    });
  } catch (error) {
    handleError(error);
  }
}
export async function groupShippingWeightByWrappingWithPallets(
  shippingId: number
) {
  const pallets = await prisma.pallet.findMany({
    where: { shipping_id: Number(shippingId) },
    include: {
      shipping_weight_fish: {
        include: {
          wrapping_weight_type: true,
          quality: true,
        },
      },
    },
  });

  return pallets.map((pallet) => {
    const groups: Record<
      string,
      Record<
        string,
        {
          total_weight: number;
          total_box: number;
          qualities: string[];
        }
      >
    > = {};

    for (const fish of pallet.shipping_weight_fish) {
      const wrappingType = fish.wrapping_type;
      const weightType = fish.wrapping_weight_type?.name || "UNKNOWN";
      const qualityCode = fish.quality?.code;

      if (!groups[wrappingType]) {
        groups[wrappingType] = {};
      }

      if (!groups[wrappingType][weightType]) {
        groups[wrappingType][weightType] = {
          total_weight: 0,
          total_box: 0,
          qualities: [],
        };
      }

      groups[wrappingType][weightType].total_weight += fish.weight;
      groups[wrappingType][weightType].total_box += fish.box;

      if (
        qualityCode &&
        !groups[wrappingType][weightType].qualities.includes(qualityCode)
      ) {
        groups[wrappingType][weightType].qualities.push(qualityCode);
      }
    }

    return {
      palletNumber: pallet.pallet_number,
      palletId: pallet.id,
      groups,
    };
  });
}
