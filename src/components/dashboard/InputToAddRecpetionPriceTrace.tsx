"use client";

import { Input } from "../ui/input";
import { receptionPriceFormSchema } from "@/lib/validator";
import { useState } from "react";
import {
  removeReceptionPriceRace,
  updateReception,
} from "@/lib/actions/reception.actions";
import { toast } from "sonner";

export default function InputToAddRecpetionPriceTace({
  receptionId,
  defultValue,
  totalWeightTrace,
  showInput,
}: {
  receptionId: number;
  defultValue?: number;
  totalWeightTrace: number;
  showInput:boolean;
}) {
  const [error, setRror] = useState<string | undefined>("");
  const addPrice = async ({ price }: { price: number }) => {
    const validatedData = receptionPriceFormSchema.safeParse({
      price_kg: price,
    });

    if (defultValue && price == 0 && !price) {
      const res = await removeReceptionPriceRace({
        path: "/dashboard/reception/add-price",
        reception_id: receptionId,
      });
      if (res) {
        toast.success("créé avec succès");
      }
      return;
    }

    if (validatedData.success) {
      const res = await updateReception({
        path: ["/dashboard/reception/add-price"],
        reception: {
          id: receptionId,
          untraced_price_kg: validatedData.data.price_kg,
        },
      });
      if (res) {
        toast.success("créé avec succès");
      }
      return;
    }

    setRror(validatedData.error?.errors[0].message);
  };

  return (
    <>
      <td className="flex flex-col items-center justify-center mt-3 px-4">
        <Input
          type="number"
          defaultValue={defultValue}
          onBlur={(e) => addPrice({ price: Number(e.target.value) })}
          className={`w-[130px] text-center !text-lg font-medium ${!showInput && "border-0 shadow-none"}`}
        />
        <span className="text-red-400 text-xs py-2">{error}</span>
      </td>
      <td className="pr-6 text-lg font-medium text-gray-800 whitespace-nowrap">
        {((defultValue ?? 0) * totalWeightTrace).toLocaleString("fr-FR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}{" "}
        Dh
      </td>
    </>
  );
}
