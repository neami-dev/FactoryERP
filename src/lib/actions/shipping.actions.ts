"use server";

import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { handleError } from "@/lib/utils";
import { shippingFormSchema } from "../validator";
import { IShipping } from "@/interfaces";
import { WrappingTypeBreakdown } from "@/types";

export type ShippingFormData = z.infer<typeof shippingFormSchema>;

// CREATE
export async function createShipping({
  shipping,
  path,
}: {
  shipping: ShippingFormData;
  path: string;
}) {
  try {
    const validatedData = shippingFormSchema.parse(shipping);
    const newShipping = await prisma.shipping.create({
      data: validatedData,
    });
    revalidatePath(path);
    return JSON.parse(JSON.stringify(newShipping)) as IShipping;
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateShipping({
  shipping,
  path,
}: {
  shipping: Partial<ShippingFormData>;
  path: string;
}) {
  try {
    if (!shipping.id) return;
    const validatedData = shippingFormSchema.partial().parse(shipping);
    const updated = await prisma.shipping.update({
      where: { id: Number(validatedData.id) },
      data: validatedData,
    });
    revalidatePath(path);
    return JSON.parse(JSON.stringify(updated)) as IShipping;
  } catch (error) {
    handleError(error);
  }
}

// GET BY ID
export async function getShippingById(id: number) {
  try {
    const shipping = await prisma.shipping.findUnique({
      where: { id: Number(id) },
      include: {
        client: { include: { person: true } },
        weigher: { include: { person: true } },
        shipping_Fish_category: {
          include: {
            fish_category: true,
            shipping_weight_fish: {
              include: { wrapping_weight_type: true },
            },
          },
        },
      },
    });
    const allPalltes = await prisma.pallet.findMany({
      where:{
        shipping_id:Number(id)
      },
      include:{
        shipping_weight_fish: true,
      }
    })
    let total_weight = 0;

    await Promise.all(
      allPalltes.map(pallet=>total_weight += pallet.shipping_weight_fish.reduce((sum,item)=>sum+item.weight,0)
    ))

    return JSON.parse(JSON.stringify({...shipping,total_weight})) as IShipping;
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteShipping({
  id,
  path,
}: {
  id: number;
  path: string;
}) {
  try {
    await prisma.shipping.delete({ where: { id } });
    revalidatePath(path);
    return { success: true };
  } catch (error) {
    handleError(error);
  }
}

// GET ALL
export async function getAllShippings({
  page = 1,
  limit = 10,
  lastnameOrFistname,
}: {
  page?: number;
  limit?: number;
  lastnameOrFistname?: string;
}): Promise<
  | {
      data: IShipping[];
      total: number;
      page: number;
      totalPages: number;
    }
  | undefined
> {
  try {
    const skip = (page - 1) * limit;
    const [shippings, total] = await Promise.all([
      prisma.shipping.findMany({
        where: {
          client: {
            person: {
              OR: [
                {
                  firstname: {
                    contains: lastnameOrFistname?.toLowerCase(),
                  },
                },
                {
                  lastname: {
                    contains: lastnameOrFistname?.toLowerCase(),
                  },
                },
              ],
            },
          },
        },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: {
          client: { include: { person: true } },
          weigher: { include: { person: true } },
          shipping_Fish_category: {
            include: {
              fish_category: true,
              shipping_weight_fish: true,
            },
          },
        },
      }),
      prisma.shipping.count({
        where: {
          client: {
            person: {
              OR: [
                {
                  firstname: {
                    contains: lastnameOrFistname?.toLowerCase(),
                  },
                },
                {
                  lastname: {
                    contains: lastnameOrFistname?.toLowerCase(),
                  },
                },
              ],
            },
          },
        },
      }),
    ]);
    const shippingsWithTotalWeight = await Promise.all(
      shippings.map(async (shipping) => {
        const result = await getShippingTotalsById(shipping.id);
        return {
          total_weight: result?.totalWeight,
          total_pallets: result?.totalPallets,
          ...shipping,
        };
      })
    );

    return {
      data: JSON.parse(JSON.stringify(shippingsWithTotalWeight)) as IShipping[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
export async function getShippingsUnfinihsed() {
  try {
    const shippings = await prisma.shipping.findMany({
      where: {
        isFinished: false,
      },
      orderBy: { created_at: "desc" },
      include: {
        shipping_Fish_category: {
          include: {
            fish_category: true,
          },
        },
        client: {
          include: { person: true },
        },
        weigher: {
          include: {
            person: true,
          },
        },
      },
    });

    return {
      data: JSON.parse(JSON.stringify(shippings)) as IShipping[],
    };
  } catch (error) {
    handleError(error);
  }
}

export async function getShippingTotalsById(shippingId: number) {
  try {
    const pallets = await prisma.pallet.findMany({
      where: { shipping_id: Number(shippingId) },
      include: {
        shipping_weight_fish: true,
      },
    });

    let totalWeight = 0;
    let totalBoxes = 0;

    for (const pallet of pallets) {
      for (const fish of pallet.shipping_weight_fish) {
        totalWeight += fish.weight;
        totalBoxes += fish.box;
      }
    }

    return {
      totalWeight,
      totalBoxes,
      totalPallets: pallets.length,
    };
  } catch (error) {
    handleError(error);
  }
}

export async function getQualityBreakdownByShippingId(shippingId: number) {
  try {
    const pallets = await prisma.pallet.findMany({
      where: { shipping_id: Number(shippingId) },
      include: {
        shipping_weight_fish: {
          include: {
            quality: true,
          },
        },
      },
    });

    const breakdown: Record<
      string,
      { weight: number; boxes: number; description: string }
    > = {};

    for (const pallet of pallets) {
      for (const item of pallet.shipping_weight_fish) {
        const qualityCode = item.quality.code;
        if (!breakdown[qualityCode]) {
          breakdown[qualityCode] = {
            weight: 0,
            boxes: 0,
            description: item.quality.title,
          };
        }

        breakdown[qualityCode].weight += item.weight;
        breakdown[qualityCode].boxes += item.box;
      }
    }

    return breakdown;
  } catch (error) {
    handleError(error);
  }
}

export async function getWrappingTypeBreakdownByShippingId(shippingId: number) {
  try {
    const pallets = await prisma.pallet.findMany({
      where: { shipping_id: Number(shippingId) },
      include: {
        shipping_weight_fish: true,
      },
    });

    const breakdownMap = new Map<
      string,
      {
        weight: number;
        boxes: number;
        pallets: Set<number>;
      }
    >();

    for (const pallet of pallets) {
      for (const swf of pallet.shipping_weight_fish) {
        const type = swf.wrapping_type;
        if (!breakdownMap.has(type)) {
          breakdownMap.set(type, {
            weight: 0,
            boxes: 0,
            pallets: new Set(),
          });
        }

        const current = breakdownMap.get(type)!;
        current.weight += swf.weight;
        current.boxes += swf.box;
        current.pallets.add(pallet.id);
      }
    }

    const result: WrappingTypeBreakdown[] = [];

    for (const [type, data] of breakdownMap.entries()) {
      result.push({
        type,
        weight: data.weight,
        boxes: data.boxes,
        pallets: data.pallets.size,
      });
    }

    return result;
  } catch (error) {
    handleError(error);
  }
}
