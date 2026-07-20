"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { receptionDefaultValues } from "@/constants";
import * as z from "zod";
import { receptionFormSchema } from "@/lib/validator";
import {
  createReception,
  updateReception,
} from "@/lib/actions/reception.actions";
import { ICategory, IReception, ISupplier } from "@/interfaces";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Fish, Loader2, MapPin, User } from "lucide-react";

import { useEffect, useState } from "react";
import FishSelection from "../others/FishSelection";
import { getCategoryById } from "@/lib/actions/fishCategory.actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateSupplierPopUp from "./CreateSupplierPopUp";
import { toast } from "sonner";

type ReceptionFormProps = {
  weigher_id?: number;
  type: "Create" | "Update";
  reception?: IReception | null;
  reception_id?: number | null;
  suppliers?: ISupplier[] | null;
  categories?: ICategory[];
  isTraceability?: boolean;
};
export default function ReceptionForm({
  weigher_id,
  type,
  reception,
  reception_id,
  suppliers,
  categories,
  isTraceability,
}: ReceptionFormProps) {
  const router = useRouter();
  const [fishCategoryName, setFishCategoryName] = useState<string | null>("");
  const [isFishDialogOpen, setIsFishDialogOpen] = useState(false);

  const initialValues =
    reception && type === "Update"
      ? {
          plate_number: reception.plate_number,
          tare_weight: reception.tare_weight,
          origin: reception.origin,
          supplier_id: reception.supplier_id,
          fish_category: reception.fish_category
            ? String(reception.fish_category.name)
            : undefined,
        }
      : receptionDefaultValues;

  const form = useForm<z.infer<typeof receptionFormSchema>>({
    resolver: zodResolver(receptionFormSchema),
    defaultValues: initialValues,
  });
  if (isTraceability) {
    form.setValue("tare_weight", 2);
  }
  useEffect(() => {
    if (type === "Update" && reception) {
      form.setValue("fish_category_id", reception.fish_category_id);
      setFishCategoryName(reception.fish_category?.name || null);
    }
  }, [type, form]);

  async function onSubmit(values: z.infer<typeof receptionFormSchema>) {
    if (type === "Create" && weigher_id) {
      try {
        const newReception = await createReception({
          reception: {
            ...values,
            isFinished: !!isTraceability,
            isTrace: !!isTraceability,
            fish_category_id: values.fish_category_id,
            supplier_id: values.supplier_id,
          },
          weigher_id,
          path: "/reception/history",
        });

        if (newReception) {
          // handleRefreshCache();
          form.reset();
          toast.success("créé avec succès");
          setFishCategoryName("");
          if (isTraceability) {
            return router.push(
              `/traceability/create?receptionId=${String(newReception.id)}`
            );
          }
          router.push(
            `/reception-weight-fish/create?receptionId=${String(
              newReception.id
            )}`
          );
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (type === "Update") {
      if (!reception_id) {
        router.back();
        return;
      }
      try {
        const updatedReception = await updateReception({
          reception: {
            ...values,
            id: reception_id,
            supplier_id: values.supplier_id,
          },
          path: ["/"],
        });
        if (updatedReception) {
          toast.success("Modifier avec succès");
          router.back();
          form.reset();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleSelectedId = async (id: number) => {
    const category = await getCategoryById(id);
    form.setValue("fish_category_id", id);
    setFishCategoryName(category?.data.name || null);

    setIsFishDialogOpen(false);
  };
  const handleSelectSupllier = async (id: number) => {
    form.setValue("supplier_id", id);
  };

  return (
    <section>
      <Form {...form}>
        <div className="flex flex-col gap-8">
          <div className="sm:min-w-[300px] flex flex-col gap-3 lg:gap-6 ">
            {" "}
            <FormField
              control={form.control}
              name="supplier_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="p-1 text-lg flex gap-3 capitalize  text-gray-700">
                    <User width={25} className="text-[#3354f4]" />
                    fournisseur
                  </FormLabel>

                  <div className="flex items-center justify-between">
                    <FormControl className="">
                      <Select
                        {...field}
                        value={field?.value ? String(field.value) : ""}
                        onValueChange={(value: string) =>
                          field.onChange(Number(value))
                        }
                      >
                        <SelectTrigger
                          tabIndex={3}
                          className={`w-full cursor-pointer rounded-none rounded-l-lg  py-5 px-4 !text-lg font-semibold`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="font-semibold  ">
                          {suppliers?.length === 0 && (
                            <div className="w-full h-20 flex items-center justify-center text-gray-500 font-semibold">
                              Aucun fournisseur
                            </div>
                          )}
                          {suppliers?.map((supplier) => {
                            return (
                              <SelectItem
                                className="text-lg"
                                key={supplier.id}
                                value={String(supplier.id) || ""}
                              >
                                {supplier?.person?.firstname}{" "}
                                {supplier?.person?.lastname}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <CreateSupplierPopUp
                      handleSelectSupllier={handleSelectSupllier}
                    />
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fish_category_id"
              render={() => (
                <FormItem className="w-full">
                  <FormLabel className="p-1 text-lg flex gap-3 capitalize  text-gray-700">
                    <Fish width={25} className="text-[#3354f4]" />
                    espace
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={type === "Update"}
                      // {...field}
                      defaultValue={fishCategoryName || ""}
                      className="  py-5 px-4 font-semibold capitalize !text-lg "
                      onClick={() => setIsFishDialogOpen(true)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isTraceability && (
              <FormField
                control={form.control}
                name="tare_weight"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="p-1 text-lg flex gap-3 capitalize  text-gray-700">
                      <div className="relative w-[25px] h-[25px]">
                        <Image
                          src="/icons/tare.svg"
                          alt="plate"
                          fill
                          className="object-contain text-[#3354f4]"
                        />
                      </div>
                      Tare
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="  py-5 px-4 font-semibold capitalize !text-lg "
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="p-1 text-lg flex gap-3 capitalize text-gray-700">
                    <MapPin width={25} className="text-[#3354f4]" />
                    origine
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="input-field py-5 px-4 !text-lg font-semibold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plate_number"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className=" text-lg flex gap-3 capitalize  text-gray-700">
                    <div className="relative w-[30px] h-[30px]">
                      <Image
                        src="/icons/license-plate-number.svg"
                        alt="plate"
                        fill
                        className="object-contain text-[#3354f4]"
                      />
                    </div>
                    Matricule du camion
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="input-field py-5 px-4 !text-lg font-semibold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            onClick={form.handleSubmit(onSubmit)}
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
            className="button col-span-2 text-lg  w-fit mx-auto bg-[#3354f4] cursor-pointer hover:bg-blue-700"
          >
            {form.formState.isSubmitting ? (
              <p className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Soumission...
              </p>
            ) : type === "Update" ? (
              `Modifier Réception`
            ) : (
              "Créer Réception"
            )}
          </Button>
        </div>
      </Form>
      <Dialog open={isFishDialogOpen} onOpenChange={setIsFishDialogOpen}>
        <DialogContent className="w-full  flex flex-col">
          <DialogHeader className="h-fit">
            <DialogTitle className="text-xl py-5 md:text-2xl xl:text-4xl text-center font-bold text-blue-600">
              Sélectionnez un espace
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <FishSelection
            fishcategories={categories}
            handleSelectedId={handleSelectedId}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}
