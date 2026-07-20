"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { shippingFormSchema } from "@/lib/validator";

import { IClient, IShipping } from "@/interfaces";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, User } from "lucide-react";

import { useEffect } from "react";

import CreateClientPopUp from "../wrapping/CreateClientPopUp";
import { createShipping, updateShipping } from "@/lib/actions/shipping.actions";
import Image from "next/image";
import { Input } from "../ui/input";
import { toast } from "sonner";

type WrappingFormProps = {
  weigher_id?: number;
  type: "Create" | "Update";
  shipping?: IShipping | null;
  shipping_id?: number | null;
  clients?: IClient[] | null;
};
export default function ShippingForm({
  weigher_id,
  type,
  shipping,
  shipping_id,
  clients,
}: WrappingFormProps) {
  const router = useRouter();

  const initialValues =
    shipping && type === "Update"
      ? {
          ...shipping,
        }
      : {
          client_id: undefined,
          plate_number: "",
          weigher_id: weigher_id ?? undefined,
        };

  const form = useForm<z.infer<typeof shippingFormSchema>>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (weigher_id) {
      form.setValue("weigher_id", Number(weigher_id));
    }
  }, [weigher_id, form]);

  async function onSubmit(values: z.infer<typeof shippingFormSchema>) {
    if (type === "Create" && weigher_id) {
      try {
        const newShipping = await createShipping({
          shipping: { ...values, weigher_id: Number(values.weigher_id) },
          path: "/",
        });

        if (newShipping) {
          form.reset();
          toast.success("créé avec succès");
          router.push(
            `/shipping/select-category?shippingId=${String(newShipping.id)}`
          );
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (type === "Update") {
      if (!shipping_id) {
        router.back();
        return;
      }
      try {
        const updatedShipping = await updateShipping({
          shipping: values,
          path: "/invoice/shipping-weights",
        });
        if (updatedShipping) {
          toast.success("Modifier avec succès");
          router.back();
          form.reset();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

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
                    Matricul camion
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
                "Modifier l’expédition"
              ) : (
                "Créer une expédition"
              )}
            </Button>
          </div>
        </div>
      </Form>
    </section>
  );
}
