"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { receptionWFDefaultValues } from "@/constants";
import * as z from "zod";
import { IQuality, IReceptionWeightFish, IWeightType } from "@/interfaces";
import { useRouter } from "next/navigation";
import {
  createReceptionWeightFish,
  updateReceptionWeightFish,
} from "@/lib/actions/receptionWeightFish.actions";
import { receptionWFFormSchema } from "@/lib/validator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useState } from "react";
import Image from "next/image";

import ReceptionKeypad from "./ReceptionKeypad";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type ReceptionWeightFishFormProps = {
  type: "Create" | "Update";
  weight_types?: IWeightType[];
  reception_weight_fish?: IReceptionWeightFish | null;
  reception_weight_fish_id?: number;
  reception_id: number;
  all_qualities?: IQuality[];
};
export type FormValues = {
  weight: string;
  crate: string;
  weight_type_id: string;
};
export default function ReceptionWeightFishForm({
  type,
  weight_types,
  reception_weight_fish,
  reception_id,
  reception_weight_fish_id,
  all_qualities,
}: ReceptionWeightFishFormProps) {

  const [activeField, setActiveField] = useState<keyof FormValues | null>(
    "weight"
  );

  const router = useRouter();

  const initialValues =
    reception_weight_fish && type === "Update"
      ? {
          ...reception_weight_fish,
          weight: String(reception_weight_fish.weight),
        }
      : receptionWFDefaultValues;

  const form = useForm<z.infer<typeof receptionWFFormSchema>>({
    resolver: zodResolver(receptionWFFormSchema),
    defaultValues: initialValues,
  });
  const getDatafromLocalSrorage = () => {
    if (type === "Update") return;
    const quality_id = localStorage.getItem("reception_quality_id");

    if (quality_id) form.setValue("quality_id", Number(quality_id));
  };
  useEffect(() => {
    getDatafromLocalSrorage();
  }, [form]);
  const { setValue, getValues, reset } = form;
  async function onSubmit(values: z.infer<typeof receptionWFFormSchema>) {
    if (type === "Create" && reception_id) {
      try {
        const newReception = await createReceptionWeightFish({
          reception_weight_fish: {
            weight: String(values.weight),
            crate: Number(values.crate),
            weight_type_id: Number(values.weight_type_id),
            quality_id: Number(values.quality_id),
          },
          reception_id,
          paths: ["/reception-weight-fish/create", "/dashboard/reception"],
        });

        if (newReception) {
          reset();
          toast.success("créé avec succès");
          setActiveField("weight");
          localStorage.setItem(
            "reception_quality_id",
            String(values.quality_id)
          );
          getDatafromLocalSrorage();
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (type === "Update") {
      if (!reception_weight_fish_id) {
        router.back();
        return;
      }

      try {
        const updatedReception = await updateReceptionWeightFish({
          reception_weight_fish: {
            weight: values.weight,
            crate: Number(values.crate),
            weight_type_id: Number(values.weight_type_id),
            id: reception_weight_fish_id,
            quality_id: Number(values.quality_id),
          },
          path: `/reception-weight-fish/create`,
        });

        if (updatedReception) {
          router.back();
          reset();
          toast.success("Modifier avec succès");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  /** Handle keypad input **/
  const handleKeypadInput = (value: string) => {
    let currentValue;
    if (!activeField) {
      currentValue = getValues("weight");
    }

    currentValue = activeField
      ? getValues(activeField as "weight" | "crate" | "weight_type_id") || ""
      : "";

    if (value === "del") {
      currentValue = String(currentValue).slice(0, -1); // Remove last character
    } else if (value === "done") {
      if (activeField == "weight") {
        setActiveField("crate");
      } else if (activeField == "crate") {
        setActiveField("weight_type_id");
      }
    } else {
      currentValue += value;
    }

    if (activeField && activeField !== "weight_type_id") {
      setValue(activeField, currentValue);
    }
  };
  return (
    <section className="flex  flex-wrap md:flex-nowrap gap-5 items-center justify-around">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex flex-col items-center gap-5 md:px-6"
        >
          <div className="w-fit flex flex-col items-center gap-3 m-auto">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem className="m-auto">
                  <FormLabel className="p-2 text-base flex gap-3  text-gray-700">
                    <Image
                      src="/icons/balance.svg"
                      alt=""
                      width={25}
                      height={25}
                    />
                    Poids (Kg)
                  </FormLabel>
                  <FormControl>
                    <Input
                      readOnly
                      {...field}
                      onFocus={() => setActiveField("weight")}
                      className={`w-full h-13 rounded-lg p-2 text-center border-1 border-gray-300 !text-2xl font-bold text-gray-700 tracking-wide   ${
                        activeField == "weight" && " ring-[3px] ring-[#c9c9c9]"
                      }`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="crate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="p-2 text-base flex gap-3  text-gray-700">
                    <Image src="/icons/box.svg" alt="" width={25} height={25} />
                    Caisse
                  </FormLabel>
                  <FormControl>
                    <Input
                      inputMode="none"
                      readOnly
                      onFocus={() => {
                        setActiveField("crate");
                      }}
                      {...field}
                      className={`w-full h-13 rounded-lg p-2 text-center border-1 border-gray-300 !text-2xl font-bold text-[#4c4848] tracking-wide focus:ring-2 ${
                        activeField == "crate" && " ring-[3px] ring-[#c9c9c9]"
                      }`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight_type_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="p-2 text-base flex gap-3  text-gray-700">
                    <Image
                      src="/icons/fish-10.svg"
                      alt=""
                      width={25}
                      height={25}
                    />{" "}
                    taille du poisson
                  </FormLabel>
                  <FormControl className="">
                    <Select
                      {...field}
                      value={String(field?.value || "")}
                      // defaultValue={String(field?.value || "")}
                      onValueChange={(value: string) =>
                        field.onChange(Number(value))
                      }
                    >
                      <SelectTrigger
                        id="weight_type_id"
                        tabIndex={3}
                        className={`w-full h-13 rounded-lg py-6 uppercase cursor-pointer text-center border border-gray-300 font-semibold text-gray-700 tracking-wide focus:ring-2${
                          activeField == "weight_type_id" &&
                          " ring-[3px] ring-[#c9c9c9]"
                        }`}
                      >
                        <SelectValue className="uppercase" />
                      </SelectTrigger>
                      <SelectContent className="font-semibold uppercase">
                        {weight_types?.length === 0 && (
                          <div className="w-full h-20 flex items-center justify-center text-gray-500 font-semibold">
                            Aucun taille de poisson
                          </div>
                        )}
                        {weight_types?.map((type) => {
                          return (
                            <SelectItem key={type.id} value={String(type.id)}>
                              {type.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quality_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="p-2 text-base flex gap-3  text-gray-700">
                    <Image
                      src="/icons/fish-10.svg"
                      alt=""
                      width={25}
                      height={25}
                    />{" "}
                    Qualite du poisson
                  </FormLabel>
                  <FormControl className="">
                    <Select
                      {...field}
                      value={String(field?.value || "")}
                      onValueChange={(value: string) =>
                        field.onChange(Number(value))
                      }
                    >
                      <SelectTrigger
                        tabIndex={3}
                        className={`w-full h-13 rounded-lg py-6 uppercase cursor-pointer text-center border border-gray-300 font-semibold text-gray-700 tracking-wide focus:ring-2${" ring-[3px] ring-[#c9c9c9]"}`}
                      >
                        <SelectValue className="uppercase" />
                      </SelectTrigger>
                      <SelectContent className="font-semibold uppercase">
                        {all_qualities?.length === 0 && (
                          <div className="w-full h-20 flex items-center justify-center text-gray-500 font-semibold">
                            Aucun qualite
                          </div>
                        )}
                        {all_qualities?.map((q) => {
                          return (
                            <SelectItem key={q.id} value={String(q.id)}>
                              {q.code}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button col-span-2 tracking-wider text-white w-fit m-auto my-6 px-16 bg-[#3354f4] cursor-pointer hover:bg-blue-700"
          >
            {form.formState.isSubmitting ? (
              <p className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Soumission...
              </p>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </form>
      </Form>
      <ReceptionKeypad
        onKeyPress={handleKeypadInput}
        activeField={activeField}
      />
    </section>
  );
}
