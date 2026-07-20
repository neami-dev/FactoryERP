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
import {
  ICategory,
  IPallet,
  IQuality,
  IShippingWeightFish,
  IWeightType,
} from "@/interfaces";
import { useRouter, useSearchParams } from "next/navigation";

import { shippingWeightFishSchema } from "@/lib/validator";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import FishSelection from "../others/FishSelection";
import { RefreshCwIcon } from "lucide-react";
import { changeCategoryFish } from "@/lib/actions/shippingFishCategory.actions";
import {
  createPalletOrGetLast,
  getLastpalletInShipping,
} from "@/lib/actions/pallet.actions";
import ClosePallet from "./ClosePallet";
import WrappingKeypad from "../WrappingKeypad";
import {
  createShippingWeightFish,
  updateShippingWeightFish,
} from "@/lib/actions/shippingWeightFish.actions";
import { bufferToBase64FromObject, formatFloat } from "@/lib/utils";
import { toast } from "sonner";

type ShippingWeightFishFormProps = {
  type: "Create" | "Update";
  weight_types?: IWeightType[];
  shipping_weight_fish?: IShippingWeightFish | null;
  shipping_weight_fish_id?: number;
  shipping_fish_category_id?: number;
  all_qualities?: IQuality[];
  totalWeightInStock?:number;
  total_weight?:number;
  fish_categories?: ICategory[];
  get_catgory?: ICategory;
  shipping_id?: number;
};
export type FormValues = {
  weight: string;
  box: string;
  weight_type_id: string;
};
export default function ShippingWeightFishForm({
  type,
  weight_types,
  all_qualities,
  shipping_weight_fish,
  shipping_fish_category_id,
  shipping_weight_fish_id,
  totalWeightInStock,
  total_weight,
  fish_categories,
  get_catgory,
  shipping_id,
}: ShippingWeightFishFormProps) {
  const [isFishDialogOpen, setIsFishDialogOpen] = useState(false);
  const [activeField, setActiveField] = useState<keyof FormValues | null>(
    "weight"
  );
  const [lastPallet, setLastPallet] = useState<IPallet>();
  const searchParams = useSearchParams();

  const router = useRouter();

  const initialValues =
    shipping_weight_fish && type === "Update"
      ? {
          ...shipping_weight_fish,
          weight: String(shipping_weight_fish.weight),
        }
      : wrappingWFDefaultValues;

  const form = useForm<z.infer<typeof shippingWeightFishSchema>>({
    resolver: zodResolver(shippingWeightFishSchema),
    defaultValues: initialValues,
  });
 
  const getDatafromLocalSrorage = () => {
    if (type === "Update") return;
    const boxType = localStorage.getItem("box_type");
    const wrapType = localStorage.getItem("wrapping_type");
    const quality_id = localStorage.getItem("quality_id"); 

    if (boxType) form.setValue("box_type", boxType as "CELLOPHANE" | "CARTON");
    if (wrapType) form.setValue("wrapping_type", wrapType as "BLOCK" | "IQF");
    if (quality_id) form.setValue("quality_id", Number(quality_id));
  };

  useEffect(() => {
    getDatafromLocalSrorage();
    getlastPalletInfo();
  }, []);

  const getlastPalletInfo = () => {
    if (shipping_id) {
      getLastpalletInShipping(shipping_id).then((p) => {
        if (typeof p?.id === "number") {
          form.setValue("pallet_id", p.id);
        }
        setLastPallet(p);
      });
    }
  };

  const { setValue, getValues, reset } = form;
  async function onSubmit(values: z.infer<typeof shippingWeightFishSchema>) {
    if (type === "Create" && shipping_fish_category_id && shipping_id) {
      try {
        const remaining = (totalWeightInStock ?? 0) - Number(total_weight)
        console.log(remaining); 
        
        if (remaining < Number(values.weight)) {
          toast.error("Poids insuffisant dans le stock disponible.")
          return;
        }
        const palletInfo = await createPalletOrGetLast({
          data: { shipping_id },
        });
        const newShipping = await createShippingWeightFish({
          data: {
            ...values,
            pallet_id: palletInfo?.id,
            weight: String(values.weight),
          },
          shipping_fish_category_id: shipping_fish_category_id,
          paths: ["/shipping-weight-fish/create", "/dashboard/shipping"],
        });
        localStorage.setItem("box_type", values.box_type);
        localStorage.setItem("wrapping_type", values.wrapping_type);
        localStorage.setItem("quality_id", String(values.quality_id));

        if (newShipping) {
          reset();
          toast.success("créé avec succès");
          setActiveField("weight");
          getDatafromLocalSrorage();
          getlastPalletInfo();
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (type === "Update") {
      if (!shipping_weight_fish_id) {
        router.back();
        return;
      }

      try {
        const updatedwrapping = await updateShippingWeightFish({
          id: shipping_weight_fish_id,
          data: { ...values, weight: String(values.weight) },

          path: "/wrapping-weight-fish/create",
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
  const handleChangeQuery = (newId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("shippingFishCategoryId", String(newId));

    router.push(`/shipping-weight-fish/create?${params.toString()}`);
  };
  const handleSelectFishCategory = async (categoryId: number) => {
    if (!shipping_id) return;
    const shippingFishCategory = await changeCategoryFish({
      categoryId,
      shippingId: shipping_id,
    });

    if (shippingFishCategory) {
      handleChangeQuery(shippingFishCategory.id);
    }
    setIsFishDialogOpen(false);
  };
  const handleIsClosed = (isClosed: boolean) => {
    if (isClosed) getlastPalletInfo();
  };
  return (
    <div className="flex flex-col">
      <div className="flex justify-evenly items-center">
      
      {type === "Create" && (
        <div className="flex py-8 justify-center items-center   gap-3 ">
          {get_catgory?.img && (
            <Image
              src={`data:image/png;base64,${bufferToBase64FromObject(
                get_catgory?.img
              )}`}
              alt={`${get_catgory?.name}`}
              width={70}
              height={70}
              className="rounded-xl"
              priority
            />
          )}

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => setIsFishDialogOpen(true)}
              className=" cursor-pointer border shadow py-3 bg-white hover:bg-gray-200 text-black"
            >
              <RefreshCwIcon className="text-[#3354f4]" />
              <p>Changer Espace</p>
            </Button>
            <h3 className="md:text-lg text-center font-semibold capitalize text-gray-700">
              {get_catgory?.name}
            </h3>
          </div>
        </div>
      )}  
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Stock total</p>
            <p className={`text-xl font-bold text-blue-600 ${(totalWeightInStock ?? 0 ) <= 1000 ?"text-red-600":"text-blue-600"}`}>
              {formatFloat(totalWeightInStock??0)} kg
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Poids expédié</p>
            <p className="text-xl font-bold text-green-600">
              {formatFloat(total_weight ?? 0)} kg
            </p>
          </div>
           
      </div>
      </div>
      
      <section className="flex relative flex-wrap pt-30 md:pt-5 md:flex-nowrap gap-5 items-center justify-around">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" flex flex-col  items-center gap-5 md:px-6"
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
                          activeField == "weight" &&
                          " ring-[3px] ring-[#c9c9c9]"
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
                      <Image
                        src="/icons/box.svg"
                        alt=""
                        width={25}
                        height={25}
                      />
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
              {form.formState.isSubmitting ? "Soumission..." : "Enregistrer"}
            </Button>
          </form>
        </Form>
        <div className="flex flex-col items-center pb-16 ">
          {lastPallet && !lastPallet?.is_closed && type === "Create" && (
            <div className="w-full flex items-center justify-between px-4">
              <span
                className={` inline-flex items-center rounded-md bg-blue-50 px-4 py-2  font-medium text-blue-700 ring-1 ring-purple-700/10 ring-inset`}
              >
                N/P : {lastPallet?.pallet_number}
              </span>
              <ClosePallet
                handleIsClosed={handleIsClosed}
                pallet_id={lastPallet?.id}
              />
            </div>
          )}
          <WrappingKeypad
            onKeyPress={handleKeypadInput}
            activeField={activeField}
          />
          <Dialog open={isFishDialogOpen} onOpenChange={setIsFishDialogOpen}>
            <DialogContent className="w-full  flex flex-col">
              <DialogHeader className="h-fit">
                <DialogTitle className="text-xl py-5 md:text-2xl xl:text-4xl text-center font-bold text-blue-600">
                  Sélectionnez un Espace
                </DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <FishSelection
                fishcategories={fish_categories}
                handleSelectedId={handleSelectFishCategory}
              />
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </div>
  );
}
