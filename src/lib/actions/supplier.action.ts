"use server";
import { ISupplier } from "@/interfaces";
import { prisma } from "../prisma";
import { handleError } from "../utils";
import { CreateSupplierParams } from "@/types";
import { revalidatePath } from "next/cache";

export async function createSupplier({ supplier, path }: CreateSupplierParams) {
  try {
    const newSupplier = await prisma.supplier.create({
      data: {
        person: {
          create: {
            firstname: supplier.firstname,
            lastname: supplier.lastname,
          },
        },
      },
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newSupplier)) as ISupplier;
  } catch (error) {
    handleError(error);
  }
}
// GET ALL
export async function getAllSuppliers() {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        person: true,
      },
    });

    return {
      data: JSON.parse(JSON.stringify(suppliers)) as ISupplier[],
    };
  } catch (error) {
    handleError(error);
  }
}
