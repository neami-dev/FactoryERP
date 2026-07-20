"use server";
import { CreateCompanyParams } from "@/types";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { handleError } from "../utils";
import { ICompany } from "@/interfaces";

// CREATE
export async function createCampany({ company, path }: CreateCompanyParams) {
  try {
    const newCampany = await prisma.company.create({
      data: company,
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newCampany)) as ICompany;
  } catch (error) {
    handleError(error);
  }
}

export async function getAllCompanies() {
  try {
    const allcompanies = await prisma.company.findMany();
    return {
      data: JSON.parse(JSON.stringify(allcompanies)) as ICompany[],
    };
  } catch (error) {
    handleError(error);
  }
}
