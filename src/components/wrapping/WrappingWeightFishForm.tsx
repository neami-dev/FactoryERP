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
import { wrappingWFDefaultValues } from "@/constants";
import * as z from "zod";
import { IQuality, IWeightType, IWrappingWeightFish } from "@/interfaces";
import { useRouter } from "next/navigation";

import { wrappingWeightFishSchema } from "@/lib/validator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  createWrappingWeightFish,
  updateWrappingWeightFish,
} from "@/lib/actions/wrappingWeightFish.actions";
import WrappingKeypad from "../WrappingKeypad";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type WrappingWeightFishFormProps = {
  type: "Create" | "Update";
  weight_types?: IWeightType[];
  wrapping_weight_fish?: IWrappingWeightFish | null;
  all_qualities?: IQuality[];
  wrapping_weight_fish_id?: number;
  wrapping_id: number;
};
export type FormValues = {
  weight: string;
  box: string;
  weight_type_id: string;
};
export default function WrappingWeightFishForm({
  type,
  weight_types,
  wrapping_weight_fish,
  wrapping_id,
  all_qualities,
  wrapping_weight_fish_id,
}: WrappingWeightFishFormProps) {
  const [activeField, setActiveField] = useState<keyof FormValues | null>(
    "weight"
  );
  const router = useRouter();

  const initialValues =
    wrapping_weight_fish && type === "Update"
      ? {
          ...wrapping_weight_fish,
          quality_id:wrapping_weight_fish.quality_id,
          weight: String(wrapping_weight_fish.weight),
        }
      : wrappingWFDefaultValues;

  const form = useForm<z.infer<typeof wrappingWeightFishSchema>>({
    resolver: zodResolver(wrappingWeightFishSchema),
    defaultValues: initialValues,
  });
  const getDatafromLocalSrorage = () => {
    const boxType = localStorage.getItem("box_type");
    const wrapType = localStorage.getItem("wrapping_type");
    const quality_id = localStorage.getItem("wrapping_quality_id");

    if (boxType) form.setValue("box_type", boxType as "CELLOPHANE" | "CARTON");
    if (wrapType) form.setValue("wrapping_type", wrapType as "BLOCK" | "IQF");
    if (quality_id) form.setValue("quality_id", Number(quality_id));
  };
  useEffect(() => {
    if (type==="Create") {
      getDatafromLocalSrorage();
    }
  }, [form]);

  const { setValue, getValues, reset } = form;
  async function onSubmit(values: z.infer<typeof wrappingWeightFishSchema>) {
    if (type === "Create" && wrapping_id) {
      try {
        const newwrapping = await createWrappingWeightFish({
          data: { ...values, weight: String(values.weight) },
          wrappingId: wrapping_id,
          paths: ["/wrapping-weight-fish/create", "/dashboard/wrapping"],
        });
        localStorage.setItem("box_type", values.box_type);
        localStorage.setItem("wrapping_type", values.wrapping_type);
        localStorage.setItem("wrapping_quality_id", String(values.quality_id));

        if (newwrapping) {
          reset();
          toast.success("créé avec succès");
          setActiveField("weight");
          getDatafromLocalSrorage();
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (type === "Update") {
      if (!wrapping_weight_fish_id) {
        router.back();
        return;
      }

      try {
        const updatedwrapping = await updateWrappingWeightFish({
          id: wrapping_weight_fish_id,
          data: { ...values, weight: String(values.weight) },
          wrappingId: wrapping_id,
          paths: ["/wrapping-weight-fish/create", "/dashboard/wrapping"],
        });

        if (updatedwrapping) {
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
      ? getValues(
          activeField as "weight" | "box" | "wrapping_weight_type_id"
        ) || ""
      : "";

    if (value === "del") {
      currentValue = String(currentValue).slice(0, -1); // Remove last character
    } else if (value === "done") {
      if (activeField == "weight") {
        setActiveField("box");
      } else if (activeField == "box") {
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
    <section className="flex relative flex-wrap pt-30  md:pt-5 md:flex-nowrap gap-5 items-center justify-around">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex flex-col items-center gap-5 md:px-6"
        >
          <div className="flex   absolute right-0 -top-2 gap-4  w-full justify-between items-center">
            <FormField
              control={form.control}
              name="box_type"
              render={({ field }) => (
                <ul
                  className={`items-center  w-[44%] md:ml-6 text-sm font-medium text-gray-900 bg -white border ${
                    form.formState.errors.box_type
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                >
                  {["CELLOPHANE", "CARTON"].map((type) => (
                    <li
                      key={type}
                      className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
                    >
                      <label className="flex items-center ps-3">
                        <input
                          type="radio"
                          defaultValue={type}
                          checked={field.value === type}
                          onChange={() => field.onChange(type)}
                          name="box_type"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                          {type === "CELLOPHANE" ? "Cellophane" : "Carton"}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            />

            <FormField
              control={form.control}
              name="wrapping_type"
              render={({ field }) => (
                <ul
                  className={`items-center  w-[44%]  md:ml-6 text-sm font-medium text-gray-900 bg-white border ${
                    form.formState.errors.wrapping_type
                      ? "border-red-500"
                      : "border-gray-200"
                  } rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                >
                  {["BLOCK", "IQF"].map((type) => (
                    <li
                      key={type}
                      className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
                    >
                      <label className="flex items-center ps-3">
                        <input
                          type="radio"
                          value={type}
                          checked={field.value === type}
                          onChange={() => field.onChange(type)}
                          name="wrapping_type"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                          {type}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            />
          </div>
          <div className="w-fit flex mt-4 flex-col items-center gap-3 m-auto">
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
              name="box"
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
                        setActiveField("box");
                      }}
                      {...field}
                      className={`w-full h-13 rounded-lg p-2 text-center border-1 border-gray-300 !text-2xl font-bold text-[#4c4848] tracking-wide focus:ring-2 ${
                        activeField == "box" && " ring-[3px] ring-[#c9c9c9]"
                      }`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wrapping_weight_type_id"
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
                <Loader2 className="w-4 h-4 animate-spin" /> Soumission...
              </p>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </form>
      </Form>
      <WrappingKeypad
        onKeyPress={handleKeypadInput}
        activeField={activeField}
      />
    </section>
  );
}
