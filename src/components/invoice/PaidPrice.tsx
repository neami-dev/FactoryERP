"use client";

import { receptionPaidPriceFormSchema } from "@/lib/validator";
import { Input } from "../ui/input";
import { updateReception } from "@/lib/actions/reception.actions";

import { toast } from "sonner";

export default function PaidPrice({
  receptionId,
  defaultValue,
  showInput,
}: {
  receptionId: number;
  defaultValue?: number;
  showInput:boolean
}) {
  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    const validatedData = receptionPaidPriceFormSchema.safeParse({
      paid_price: rawValue,
    });

    if (validatedData.success) {
      const res = await updateReception({
        path: ["/dashboard/reception/add-price"],
        reception: {
          id: receptionId,
          paid_price: validatedData.data.paid_price,
        },
      });
      if (res) {
        toast.success("créé avec succès");
      }
      return;
    }
  };
  return (
   
    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <label className="font-semibold text-gray-800 text-base">
              Paid Price:
            </label>
            <div className="flex items-center gap-2">
               <Input
          onBlur={handleBlur}
          defaultValue={defaultValue}
          type="number"
          placeholder="0"
          className={`!py-5 w-[140px]  placeholder:text-lg !text-lg text-right font-semibold  ${!showInput && "border-0 shadow-none bg-transparent"}`}
        />
              <span className="text-gray-600 font-medium">Dh</span>
            </div>
          </div>
      </div>
  );
}
