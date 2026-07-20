"use server";

import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { handleError } from "@/lib/utils";
import { clientFormSchema } from "../validator";
import { IClient } from "@/interfaces";

export type ClientFormData = z.infer<typeof clientFormSchema>;

// CREATE
export async function createClient({
  client,
  path,
}: {
  client: ClientFormData;
  path: string;
}) {
  try {
    const validatedData = clientFormSchema.parse(client);
 
    const newClient = await prisma.client.create({
      data: {
        client_type: validatedData.client_type || "STOCK",
        person: {
          create: {
            firstname: validatedData.firstname,
            lastname: validatedData.lastname,
          },
        },
      },
      include: {
        person: true,
      },
    });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(newClient));
  } catch (error) {
    handleError(error);
  }
}

// GET ALL
export async function getAllClients() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        person: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return {
      data: JSON.parse(JSON.stringify(clients)) as IClient[],
    };
  } catch (error) {
    handleError(error);
  }
}
