"use client";
import {
  createReceptionPrice,
  deleteReceptionPrice,
} from "@/lib/actions/receptionPricing.actions";
import { Input } from "../ui/input";
import { receptionPriceFormSchema } from "@/lib/validator";
import { useState } from "react";
import { formatFloat } from "@/lib/utils";
import { toast } from "sonner";

export default function InputToAddRecpetionPrice({
  item,
  receptionId,
  defultValue,
  showInput,
}: {
  item: {
    type: string;
    price: number;
    totalWeight: number | undefined;
    totalCrate: number | undefined;
    netWeight: number;
  };
  receptionId: number;
  defultValue?: number;
  showInput:boolean;
}) {
  
  
  const [error, setRror] = useState<string | undefined>("");
  const addPrice = async ({
    price,
    weightType,
  }: {
    price: number;
    weightType: string;
  }) => {
    const validatedData = receptionPriceFormSchema.safeParse({
      price_kg: price,
    });
    if (defultValue && price == 0 && !price) {
      const res = await deleteReceptionPrice({
        path: "/dashboard/reception/add-price",
        reception_id: receptionId,
        weight_type_name: weightType,
      });
      if (res) {
        toast.success("créé avec succès");
      }
      return;
    }

    if (validatedData.success) {
      const res = await createReceptionPrice({
        reception_id: receptionId,
        reception_price: { price_kg: price },
        weight_type_name: weightType,
        path: "/dashboard/reception/add-price",
      });
      if (res) {
        setRror("");
       toast.success("créé avec succès");
      }
      return;
    }

    setRror(validatedData.error?.errors[0].message);
  };
  return (
    <>
      <td className={`flex flex-col items-end  pt-3`}>
        <Input
          type="number"
          defaultValue={defultValue}
          onBlur={(e) =>
            addPrice({ price: Number(e.target.value), weightType: item.type })
          }
          className={`w-[130px] text-center ${!showInput && "border-0 shadow-none"}`}
        />
        <span className="text-red-400 text-xs py-2">{error}</span>
      </td>
      <td className="font-semibold text-gray-800 text-right py-4 pr-8 ">{formatFloat(item.price) || 0} Dh </td>
    </>
  );
}
