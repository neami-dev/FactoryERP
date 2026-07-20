"use server";

import { IPerson } from "@/interfaces";
import { prisma } from "../prisma";
import { handleError } from "../utils";
import { CreatePersonParams } from "@/types";
import { userFormSchema } from "../validator";
import { revalidatePath } from "next/cache";

// CREATE
export async function createPerson({ person, path }: CreatePersonParams) {
  try {
    const validatedData = userFormSchema.parse(person);

    const newReception = await prisma.person.create({
      data: {
        ...validatedData,
      },
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newReception)) as IPerson;
  } catch (error) {
    handleError(error);
  }
}
// DELETE
export async function deletePerson({ id, path }: { id: number; path: string }) {
  try {
    await prisma.supplier.deleteMany({
      where: { person_id: id },
    });

    await prisma.user.deleteMany({
      where: { person_id: id },
    });

    await prisma.person.delete({
      where: {
        id,
      },
    });

    revalidatePath(path);
    return {
      deleted: true,
      message: "",
    };
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2003"
    ) {
      return {
        deleted: false,
        message:
          "Impossible de supprimer la personne : l'enregistrement est toujours lié à d'autres données.",
      };
    }
    handleError(error);
  }
}
export async function getAllPersons({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
  username?: string;
}): Promise<
  | {
      data: IPerson[];
      total: number;
      page: number;
      totalPages: number;
    }
  | undefined
> {
  try {
    const skip = (page - 1) * limit;
    const [persons, total] = await Promise.all([
      prisma.person.findMany({
        include: {
          user: true,
          supplier: true,
        },

        skip,
        take: limit,
        orderBy: {
          created_at: "desc",
        },
      }),
      prisma.person.count(),
    ]);
    return {
      data: persons as IPerson[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
