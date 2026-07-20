"use server";

import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { handleError } from "@/lib/utils";
import { wrappingFormSchema } from "../validator";
import { IWrapping } from "@/interfaces";
import { addTotalsOnReceptions } from "./reception.actions";
import { getGroupedWeightTypesWrapping } from "./wrappingWeightFish.actions";

export type WrappingFormData = z.infer<typeof wrappingFormSchema>;

// CREATE
export async function createWrapping({
  wrapping,
  path,
}: {
  wrapping: WrappingFormData;
  path: string;
}) {
  try {
    const validatedData = wrappingFormSchema.parse(wrapping);

    const newWrapping = await prisma.wrapping.create({
      data: validatedData,
    });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(newWrapping)) as IWrapping;
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateWrapping({
  wrapping,
  path,
}: {
  wrapping: Partial<WrappingFormData>;
  path: string;
}) {
  try {
    if (!wrapping.id) return;
    const validatedData = wrappingFormSchema.partial().parse(wrapping);

    const updatedWrapping = await prisma.wrapping.update({
      where: { id: Number(validatedData.id) },
      data: validatedData,
    });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedWrapping));
  } catch (error) {
    handleError(error);
  }
}

// GET BY ID
export async function getWrappingById(
  id: number
): Promise<IWrapping | undefined> {
  try {
    const wrappingreponse = await prisma.wrapping.findUnique({
      where: { id: Number(id) },
      include: {
        client: {
          include: {
            person: true,
          },
        },
        fish_category: true,
        wrapping_weight_fish: {
          include: {
            wrapping_weight_type: true,
          },
        },
        reception_wrapping: {
          include: {
            reception: true,
          },
        },
      },
    });
    const wrapping = await addTotalsOnWrappings([
      JSON.parse(JSON.stringify(wrappingreponse)),
    ]);
    return JSON.parse(JSON.stringify(wrapping?.[0])) as IWrapping;
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteWrapping({
  id,
  path,
}: {
  id: number;
  path: string;
}) {
  try {
    await prisma.wrapping.delete({
      where: { id },
    });

    revalidatePath(path);
    return { success: true };
  } catch (error) {
    handleError(error);
  }
}

// GET ALL
export async function getAllWrappings({
  page = 1,
  limit = 10,
  lastnameOrFistname,
}: {
  page?: number;
  limit?: number;
  lastnameOrFistname?: string;
}): Promise<
  | {
      data: IWrapping[];
      total: number;
      page: number;
      totalPages: number;
    }
  | undefined
> {
  try {
    const skip = (page - 1) * limit;
    const [wrappingsReponse, total] = await Promise.all([
      prisma.wrapping.findMany({
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
        orderBy: {
          created_at: "desc",
        },
        include: {
          client: {
            include: {
              person: true,
            },
          },
          weigher: {
            include: {
              person: true,
            },
          },
          fish_category: true,
          wrapping_weight_fish: true,
          reception_wrapping: {
            include: {
              reception: true,
            },
          },
        },
        skip,
        take: limit,
      }),
      prisma.wrapping.count({
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

    const wrappings = await addTotalsOnWrappings(
      JSON.parse(JSON.stringify(wrappingsReponse))
    );

    return {
      data: JSON.parse(JSON.stringify(wrappings)) as IWrapping[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
export async function getUnfinishedWrapping() {
  try {
    const unfinishedWrappings = await prisma.wrapping.findFirst({
      where: {
        isFinished: false,
      },
    });
    return {
      data: JSON.parse(JSON.stringify(unfinishedWrappings)) as IWrapping,
    };
  } catch (error) {
    handleError(error);
  }
}

// GET ALL Wrappings UNFINISHED
export async function getWrappingsUnfinihsed() {
  try {
    const wrappings = await prisma.wrapping.findMany({
      orderBy: {
        created_at: "desc",
      },
      where: {
        isFinished: false,
      },
      include: {
        fish_category: {
          select: {
            name: true,
          },
        },

        reception_wrapping: {
          include: { reception: { select: { id: true } } },
        },
        weigher: {
          include: {
            person: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
        },
        client: {
          include: {
            person: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
        },
      },
    });

    return {
      data: JSON.parse(JSON.stringify(wrappings)) as IWrapping[],
    };
  } catch (error) {
    handleError(error);
  }
}

export async function addTotalsOnWrappings(wrappings: IWrapping[]) {
  try {
    return await Promise.all(
      wrappings.map(async (wrapping) => {
        const response = await prisma.reception_wrapping.findMany({
          where: { wrapping_id: Number(wrapping.id) },
          include: {
            reception: {
              include: {
                invoices: true,
              },
            },
          },
        });
        let totalweight = 0;

        const receptions = response.map((item) => item.reception);

        const receptionWithTotals = await addTotalsOnReceptions(
          JSON.parse(JSON.stringify(receptions))
        );

        receptionWithTotals?.map((reception) => {
          if (reception.is_wrapped) {
            totalweight += +(reception.total_weight_net ?? 0);
          } else if (
            reception.weight_taken_in_wrapping &&
            reception.total_weight_net
          ) {
            totalweight += +(
              reception.total_weight_net - reception.weight_taken_in_wrapping
            );
          }
        });
        const total_weight = await getGroupedWeightTypesWrapping(wrapping.id);
        return {
          ...wrapping,
          total_weight_receptions: totalweight,
          total_weight: total_weight?.totalWeight,
        };
      })
    );
  } catch (error) {
    handleError(error);
  }
}

export async function getTotalWeightOfStock(){
  try {
    const wrappings = await prisma.wrapping.findMany({
      where:{
        isValid:true,isFinished:true,
      },include:{
        wrapping_weight_fish:true
      },
    })
    
    let totalweightWrapping = 0;

    await Promise.all(
      wrappings.map( async wrapping=>{
        const wrappingWeighFish =  wrapping.wrapping_weight_fish
        totalweightWrapping += wrappingWeighFish.reduce(
        (sum, item) => sum + item.weight,
        0)
    }))

    const pallets = await prisma.pallet.findMany({
      where:{
        shipping:{
          isFinished:true,isValid:true
        }
      },
      include:{
        shipping_weight_fish:true
      }
    })
    let totalweightShipping = 0
    await Promise.all(
      pallets.map(pallet=>{
      const wrappingWeighFish =  pallet.shipping_weight_fish
            totalweightShipping += wrappingWeighFish.reduce(
            (sum, item) => sum + item.weight,
            0)
    }))
     
    
    return {
      totalWeight:totalweightWrapping-totalweightShipping
    }
  } catch (error) {
    handleError(error);
  }
}