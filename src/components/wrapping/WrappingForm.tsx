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

import * as z from "zod";
import { wrappingFormSchema } from "@/lib/validator";

import { ICategory, IClient, IWrapping } from "@/interfaces";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Fish, Loader2, User } from "lucide-react";

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
import CreateClientPopUp from "./CreateClientPopUp";
import { createWrapping, updateWrapping } from "@/lib/actions/wrapping.actions";
import { toast } from "sonner";

type WrappingFormProps = {
  weigher_id?: number;
  type: "Create" | "Update";
  wrapping?: IWrapping | null;
  wrapping_id?: number | null;
  clients?: IClient[] | null;
  categories?: ICategory[];
};
export default function WrappingForm({
  weigher_id,
  type,
  wrapping,
  wrapping_id,
  clients,
  categories,
}: WrappingFormProps) {
  const router = useRouter();
  const [fishCategoryName, setFishCategoryName] = useState<string | null>("");
  const [isFishDialogOpen, setIsFishDialogOpen] = useState(false);

  const initialValues =
    wrapping && type === "Update"
      ? {
          ...wrapping,
          storage_location: undefined,
          fish_category: wrapping.fish_category
            ? String(wrapping.fish_category.name)
            : undefined,
        }
      : {
          client_id: "" as unknown as number,
          fish_category_id: "" as unknown as number,
        };

  const form = useForm<z.infer<typeof wrappingFormSchema>>({
    resolver: zodResolver(wrappingFormSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (weigher_id) {
      form.setValue("weigher_id", Number(weigher_id));
    }
  }, [weigher_id, form]);

  async function onSubmit(values: z.infer<typeof wrappingFormSchema>) {
    if (type === "Create" && weigher_id) {
      try {
        const newWrapping = await createWrapping({
          wrapping: { ...values, weigher_id: Number(values.weigher_id) },
          path: "/",
        });

        if (newWrapping) {
          form.reset();
          setFishCategoryName(null);
          toast.success("créé avec succès");
          router.push(
            `/wrapping/create/select-receptions?wrappingId=${String(
              newWrapping.id
            )}`
          );
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (type === "Update") {
      if (!wrapping_id) {
        router.back();
        return;
      }
      try {
        const updatedWrapping = await updateWrapping({
          wrapping: values,
          path: "/",
        });

        if (updatedWrapping) {
          router.back();
          form.reset();
          toast.success("Modifier avec succès");
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
  const handleSelectClient = async (id: number) => {
    form.setValue("client_id", id);
  };

  return (
    <section>
      <Form {...form}>
        <div className="flex flex-col gap-8">
          <div className="sm:min-w-[300px] flex flex-col gap-3 lg:gap-6 ">
            {" "}
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="p-1 text-lg flex gap-3 capitalize  text-gray-700">
                    <User width={25} className="text-[#3354f4]" />
                    Client
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
                          className={`w-full  cursor-pointer rounded-none rounded-l-lg  py-5 px-4 !text-lg font-semibold`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="font-semibold  ">
                          {clients?.length === 0 && (
                            <div className="w-full h-20 flex items-center justify-center text-gray-500 font-semibold">
                              Aucun Client
                            </div>
                          )}
                          {clients?.map((client) => {
                            return (
                              <SelectItem
                                className="text-lg"
                                key={client.id}
                                value={String(client.id) || ""}
                              >
                                {client?.person?.firstname}{" "}
                                {client?.person?.lastname}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <CreateClientPopUp
                      handleSelectClient={handleSelectClient}
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
            <Button
              type="submit"
              size="lg"
              onClick={form.handleSubmit(onSubmit)}
              disabled={
                (type === "Create" && !form.formState.isDirty) ||
                form.formState.isSubmitting
              }
              className="button col-span-2 text-lg  w-fit mx-auto bg-[#3354f4] cursor-pointer hover:bg-blue-700"
            >
              {form.formState.isSubmitting ? (
                <p className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Soumission...
                </p>
              ) : type === "Update" ? (
                `Modifier l’emballage`
              ) : (
                "Créer l’emballage"
              )}
            </Button>
          </div>
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
