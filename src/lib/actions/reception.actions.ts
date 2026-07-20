"use server";
import { IReception } from "../../interfaces/index";
import { buildDateFilter, handleError } from "@/lib/utils";
import { CreateReceptionParams, UpdateReceptionParams } from "@/types";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import {
  receptionFormSchema,
  validateReceptionId,
  validateWeigherId,
} from "../validator";
import { getGroupedWeightTypes } from "./receptionWeightFish.actions";
import { getTotalWeightTracByReception } from "./invoice.actions";
import {
  startOfDay,
  endOfDay,
  eachDayOfInterval,
  format,
  isSameDay,
} from "date-fns";

// get total weights on receptions
export async function addTotalsOnReceptions(receptions: IReception[]) {
  try {
    return Promise.all(
      receptions.map(async (reception) => {
        const totalWeightTrace = await getTotalWeightTracByReception(
          reception.id
        );
        const receptionInfo = await getGroupedWeightTypes(reception.id);
        return {
          ...reception,
          total_weight_trace: totalWeightTrace,
          total_weight_net: receptionInfo?.totalWeightNet,
          final_price: receptionInfo?.finalPrice,
          total_price: receptionInfo?.totalPrice,
        };
      })
    );
  } catch (error) {
    handleError(error);
  }
}
// CREATE
export async function createReception({
  weigher_id,
  reception,

  path,
}: CreateReceptionParams) {
  try {
    const weighterId = validateWeigherId.parse(weigher_id);

    const validatedData = receptionFormSchema.parse(reception);

    const newReception = await prisma.reception.create({
      data: {
        ...validatedData,
        weigher_id: weighterId,
      },
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newReception)) as IReception;
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateReception({
  reception,
  path,
}: UpdateReceptionParams) {
  const validatedData = receptionFormSchema.partial().parse(reception);

  try {
    const updatedReception = await prisma.reception.update({
      where: { id: Number(reception.id) },
      data: { ...validatedData, id: Number(reception.id) },
    });
    path.map((p) => {
      revalidatePath(p);
    });

    return JSON.parse(JSON.stringify(updatedReception));
  } catch (error) {
    if ((error as { code?: string })?.code === "P2025") {
      throw new Error("Reception not found");
    }
    handleError(error);
  }
}
//
export async function removeReceptionPriceRace({
  reception_id,
  path,
}: {
  reception_id: number;

  path: string;
}) {
  try {
    const receptionId = validateReceptionId.parse(reception_id);

    const response = await prisma.reception.update({
      where: {
        id: receptionId,
      },
      data: {
        reception_pricing: undefined,
      },
    });
    revalidatePath(path);
    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    handleError(error);
  }
}
// DELETE 
export async function deleteReception(receptionId: number){
  try {
    const deleted = await prisma.reception.delete({
      where:{id:Number(receptionId)}
    })
    return deleted
  } catch (error) {
    handleError(error);
  }
}
// GET BY ID
export async function getReceptionById(receptionId: number) {
  try {
    const reception = await prisma.reception.findUnique({
      where: { id: Number(receptionId) },

      include: {
        reception_weight_fish: {
          include: {
            weight_type: true,
          },
          orderBy: {
            weight_type: {
              name: "asc",
            },
          },
        },
        invoices: true,
        fish_category: true,
        weigher: {
          include: {
            person: true,
          },
        },
        supplier: {
          include: {
            person: true,
          },
        },
      },
    });
    const receptionWithTotals = await addTotalsOnReceptions([
      JSON.parse(JSON.stringify(reception)),
    ]);

    return receptionWithTotals?.[0] as IReception;
  } catch (error) {
    if ((error as { code?: string })?.code === "P2025") {
      throw new Error("Reception not found");
    }
    handleError(error);
  }
}

// GET ALL RECEPTIONS UNFINISHED
export async function getReceptionsUnfinihsed() {
  try {
    const receptions = await prisma.reception.findMany({
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
        weigher: {
          include: {
            person: true,
          },
        },
        supplier: {
          include: {
            person: true,
          },
        },
        invoices: true,
      },
    });
    const receptionsWithTotals = await addTotalsOnReceptions(
      JSON.parse(JSON.stringify(receptions))
    );
    return {
      data: JSON.parse(JSON.stringify(receptionsWithTotals)) as IReception[],
    };
  } catch (error) {
    handleError(error);
  }
}

// check is there any reception unfinished
export async function getUnfinishedReception() {
  try {
    const reception = await prisma.reception.findFirst({
      where: {
        isFinished: false,
      },
    });

    return { data: JSON.parse(JSON.stringify(reception)) as IReception };
  } catch (error) {
    handleError(error);
  }
}

export async function getReceptions({
  page = 1,
  limit = 10,
  lastnameOrFistname,
}: {
  page?: number;
  limit?: number;
  lastnameOrFistname?: string;
}): Promise<
  | {
      data: IReception[];
      total: number;
      page: number;
      totalPages: number;
    }
  | undefined
> {
  try {
    const skip = (page - 1) * limit;

    const [receptions, total] = await Promise.all([
      prisma.reception.findMany({
        where: {
          supplier: {
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
        include: {
          reception_weight_fish: true,
          invoices: true,
          weigher: {
            include: {
              person: true,
            },
          },
          fish_category: true,
          supplier: {
            include: {
              person: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          created_at: "desc",
        },
      }),
      prisma.reception.count({
        where: {
          supplier: {
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
    const receptionsWithTotals = await addTotalsOnReceptions(
      JSON.parse(JSON.stringify(receptions))
    );
    return {
      data: receptionsWithTotals as IReception[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
// get just receptions validated
export async function getreceptionsValidated({
  page = 1,
  limit = 10,
  lastnameOrFistname,
}: {
  page?: number;
  limit?: number;
  lastnameOrFistname?: string;
}): Promise<
  | {
      data: IReception[];
      total: number;
      page: number;
      totalPages: number;
    }
  | undefined
> {
  try {
    const skip = (page - 1) * limit;
    const [receptions, total] = await Promise.all([
      prisma.reception.findMany({
        orderBy: {
          created_at: "desc",
        },
        where: {
          isFinished: true,
          isValid: true,
          supplier: {
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
        include: {
          fish_category: true,
          weigher: {
            include: {
              person: true,
            },
          },
          supplier: {
            include: {
              person: true,
            },
          },
          reception_weight_fish: true,
        },
        skip,
        take: limit,
      }),
      prisma.reception.count({
        where: {
          isFinished: true,
          isValid: true,
          supplier: {
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

    const receptionsWithTotals = await addTotalsOnReceptions(
      JSON.parse(JSON.stringify(receptions))
    );
    return {
      data: JSON.parse(JSON.stringify(receptionsWithTotals)) as IReception[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
// get just receptions no validated
export async function getreceptionsUnvalidated({
  page = 1,
  limit = 8,
}: {
  page?: number;
  limit?: number;
}): Promise<
  | {
      data: IReception[];
      total: number;
      page: number;
      totalPages: number;
    }
  | undefined
> {
  try {
    const skip = (page - 1) * limit;
    const [receptions, total] = await Promise.all([
      prisma.reception.findMany({
        orderBy: {
          created_at: "desc",
        },
        where: {
          isValid: false,
        },
        include: {
          fish_category: true,
          weigher: {
            include: {
              person: true,
            },
          },
          supplier: {
            include: {
              person: true,
            },
          },
          reception_weight_fish: true,
        },
        skip,
        take: limit,
      }),
      prisma.reception.count({
        where: {
          isValid: false,
        },
      }),
    ]);

    const receptionsWithTotals = await addTotalsOnReceptions(
      JSON.parse(JSON.stringify(receptions))
    );
    return {
      data: JSON.parse(JSON.stringify(receptionsWithTotals)) as IReception[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
export async function getreceptionsUnvalidatedAndFinishAddTrace({
  page = 1,
  limit = 8,
}: {
  page?: number;
  limit?: number;
}): Promise<
  | {
      data: IReception[];
      total: number;
      page: number;
      totalPages: number;
    }
  | undefined
> {
  try {
    const skip = (page - 1) * limit;
    const [receptions, total] = await Promise.all([
      prisma.reception.findMany({
        orderBy: {
          created_at: "desc",
        },
        where: {
          isValid: false,
          isFinished_add_trace: false,
        },
        include: {
          fish_category: true,
          weigher: {
            include: {
              person: true,
            },
          },
          supplier: {
            include: {
              person: true,
            },
          },
          reception_weight_fish: true,
        },
        skip,
        take: limit,
      }),
      prisma.reception.count({
        where: {
          isValid: false,
        },
      }),
    ]);

    const receptionsWithTotals = await addTotalsOnReceptions(
      JSON.parse(JSON.stringify(receptions))
    );
    return {
      data: JSON.parse(JSON.stringify(receptionsWithTotals)) as IReception[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

export async function getReceptionsNotWrapped({
  page = 1,
  limit = 8,
  fishCategoryId,
}: {
  page?: number;
  limit?: number;
  fishCategoryId?: number;
}): Promise<
  | {
      data: IReception[];
      total: number;
      page: number;
      totalPages: number;
    }
  | undefined
> {
  try {
    const skip = (page - 1) * limit;
    const [receptions, total] = await Promise.all([
      prisma.reception.findMany({
        orderBy: {
          created_at: "desc",
        },
        where: {
          isValid: true,
          isFinished: true,
          is_wrapped: false,
          isTrace: false,
          fish_category: {
            id: Number(fishCategoryId),
          },
        },
        include: {
          fish_category: true,
          weigher: {
            include: {
              person: true,
            },
          },
          supplier: {
            include: {
              person: true,
            },
          },
          reception_weight_fish: true,
        },
        skip,
        take: limit,
      }),
      prisma.reception.count({
        where: {
          isValid: true,
          isFinished: true,
          is_wrapped: false,
        },
      }),
    ]);

    let receptionsWithTotals = await addTotalsOnReceptions(
      JSON.parse(JSON.stringify(receptions))
    );
    receptionsWithTotals = receptionsWithTotals?.filter(
      (res) => res?.total_weight_net && res?.total_weight_net > 0
    );

    return {
      data: JSON.parse(JSON.stringify(receptionsWithTotals)) as IReception[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

export async function getReceptionsByWrappingId(wrappingId: number) {
  try {
    const links = await prisma.reception_wrapping.findMany({
      where: {
        wrapping_id: Number(wrappingId),
      },
      include: {
        reception: {
          include: {
            fish_category: true,
            weigher: {
              include: {
                person: true,
              },
            },
            supplier: {
              include: {
                person: true,
              },
            },
            reception_weight_fish: true,
            invoices: true,
          },
        },
      },
    });

    const receptions = links.map((link) => link.reception);
    const receptionsWithTotals = await addTotalsOnReceptions(
      JSON.parse(JSON.stringify(receptions))
    );
    return {
      data: JSON.parse(JSON.stringify(receptionsWithTotals)) as IReception[],
    };
  } catch (error) {
    handleError(error);
  }
}

export async function getReceptionsInfos({
  period = "month",
  startDate,
  endDate,
}: {
  period?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<
  | {
      totalReptions: number;
      totalRNotWrapped: number;
      totalWeightRWrapped: number;
      totalPrice: number;
    }
  | undefined
> {
  try {
    const now = new Date();
    const dateFilter = buildDateFilter(period, now, startDate, endDate);

    const totalReptions = await prisma.reception.count({
      where: {
        created_at: dateFilter,
        isValid:true,
        isFinished:true ,
      },
    });

    const notWrapped = await prisma.reception.count({
      where: {
        created_at: dateFilter,
        is_wrapped: false,
        isValid:true,
        isFinished:true ,
        OR: [
          { weight_taken_in_wrapping: 0 },
          { weight_taken_in_wrapping: null },
        ],
      },
    });

    const wrapped = await prisma.reception.findMany({
      where: {
        created_at: dateFilter,
        isValid:true,
        isFinished:true ,
        OR: [
          { is_wrapped: true},
          {
            weight_taken_in_wrapping: {
              gt: 0,
            },
          },
        ],
      },
    });
    const receptionsPrice = await prisma.reception.findMany({
      where: {
        isFinished: true,
        isValid: true,
        created_at: dateFilter,
      },
      select: {
        id: true,
      },
    });
    const prices = await Promise.all(
      receptionsPrice.map((reception) => getGroupedWeightTypes(reception.id))
    );

    const totalPrice = prices.reduce((sum, p) => sum + (p?.finalPrice ?? 0), 0);

    const recptionsInfo = await addTotalsOnReceptions(
      JSON.parse(JSON.stringify(wrapped))
    );

    const totalWeightRWrapped =
      recptionsInfo?.reduce(
        (sum, item) => sum + (item?.total_weight_net ?? 0),
        0
      ) ?? 0;

    return {
      totalReptions,
      totalRNotWrapped: notWrapped,
      totalWeightRWrapped,
      totalPrice,
    };
  } catch (error) {
    handleError(error);
  }
}
type DateRange = {
  period?: string;
  startDate?: Date;
  endDate?: Date;
};

export async function getDailyReceptionWrappingStats({
  period = "week",
  startDate,
  endDate,
}: DateRange) {
  const now = new Date();
  const dateFilter = buildDateFilter(period, now, startDate, endDate);

  // let units: string[] = [];
  let labelFormat = "dd"; // default: day of month
  // let groupByFn = (date: Date) => format(date, labelFormat);

  if (period === "week") {
    // units = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    labelFormat = "EEE";
  } else if (period === "year") {
    // units = [
    //   "Janv",
    //   "Févr",
    //   "Mars",
    //   "Avr",
    //   "Mai",
    //   "Juin",
    //   "Juil",
    //   "Août",
    //   "Sept",
    //   "Oct",
    //   "Nov",
    //   "Déc",
    // ];
    labelFormat = "MMM";
    // groupByFn = (date: Date) => format(date, labelFormat);
  } else if (period === "custom" && startDate && endDate) {
    const diffDays = eachDayOfInterval({
      start: startDate,
      end: endDate,
    }).length;
    if (diffDays > 31) {
      labelFormat = "MMM dd";
    }
  }

  const daysInRange = eachDayOfInterval({
    start: startOfDay(dateFilter.gte),
    end: endOfDay(dateFilter.lte),
  });

  const [receptions, wrappings] = await Promise.all([
    prisma.reception.findMany({
      where: { created_at: dateFilter,
         isValid:true,
        isFinished:true , },
      select: { created_at: true },
    }),
    prisma.wrapping.findMany({
      where: { created_at: dateFilter,
        isValid:true,
        isFinished:true ,
       },
      select: { created_at: true },
    }),
  ]);

  const dailyStats = daysInRange.map((day) => {
    const dayLabel = format(day, labelFormat);

    const receptionsCount = receptions.filter((r) =>
      isSameDay(r.created_at, day)
    ).length;
    const wrappingsCount = wrappings.filter((w) =>
      isSameDay(w.created_at, day)
    ).length;

    return {
      day: dayLabel,
      receptions: receptionsCount,
      wrappings: wrappingsCount,
    };
  });

  return dailyStats;
}
