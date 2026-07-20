"use server";
import { revalidatePath } from "next/cache";
import { handleError } from "../utils";
import { CreateInvoiceParams, UpdateInvoiceParams } from "@/types";
import { prisma } from "../prisma";
import { IInvoice } from "@/interfaces";
import { invoiceFormSchema, validateReceptionId } from "../validator";

// CREATE
export async function createInvoice({
  invoice,
  reception_id,
  path,
}: CreateInvoiceParams) {
  const receptionId = validateReceptionId.parse(reception_id);
  const validatedData = invoiceFormSchema.parse(invoice);
  try {
    const reception = await prisma.reception.findUnique({
      where: {
        id: receptionId,
      },
    });

    const newInvoice = await prisma.invoice.create({
      data: { ...validatedData, reception_id: receptionId },
    });

    if (
      (reception?.invoiceStatus === "HAVENOT" ||
        reception?.invoiceStatus === "NONE") &&
      newInvoice
    ) {
      await prisma.reception.update({
        where: {
          id: receptionId,
        },
        data: {
          invoiceStatus: "FULL",
        },
      });
    }
    revalidatePath(path);

    return JSON.parse(JSON.stringify(newInvoice));
  } catch (error) {
    handleError(error);
  }
}
// UPDATE
export async function updateInvoice({
  invoice,
  reception_id,
  path,
}: UpdateInvoiceParams) {
  const receptionId = validateReceptionId.optional().parse(reception_id);
  const validatedData = invoiceFormSchema.partial().parse(invoice);
  try {
    const newInvoice = await prisma.invoice.update({
      where: {
        id: Number(invoice.id),
      },
      data: { ...validatedData, reception_id: receptionId },
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newInvoice));
  } catch (error) {
    handleError(error);
  }
}
export async function getLastInvoice(receptionId: number) {
  try {
    const response = await prisma.invoice.findFirst({
      where: { reception_id: Number(receptionId) },
      orderBy: {
        created_at: "desc",
      },
      include: {
        company: true,
      },
    });

    return {
      data: JSON.parse(JSON.stringify(response)) as IInvoice,
    };
  } catch (error) {
    handleError(error);
  }
}
export async function getInvoicesByReception(receptionId: number) {
  try {
    const allInvoices = await prisma.invoice.findMany({
      where: {
        reception_id: Number(receptionId),
      },
      include: {
        company: true,
      },
    });
    return {
      data: JSON.parse(JSON.stringify(allInvoices)) as IInvoice[],
    };
  } catch (error) {
    handleError(error);
  }
}
export async function getTotalWeightTracByReception(receptionId: number) {
  try {
    const validatedReception_id = validateReceptionId.parse(receptionId);
    const result = await prisma.invoice.aggregate({
      where: {
        reception_id: Number(validatedReception_id),
      },
      _sum: {
        total_weight: true,
      },
    });
    const totalWeight = result._sum.total_weight ?? 0;

    return totalWeight;
  } catch (error) {
    handleError(error);
  }
}
// GET BY ID
export async function getInvoicesById(invoiceId: number) {
  try {
    const invoices = await prisma.invoice.findUnique({
      where: {
        id: Number(invoiceId),
      },
      include: {
        company: true,
      },
    });
    return {
      data: JSON.parse(JSON.stringify(invoices)) as IInvoice,
    };
  } catch (error) {
    handleError(error);
  }
}
