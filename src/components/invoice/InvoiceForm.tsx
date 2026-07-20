"use client";
import { invoiceDefaultValues } from "@/constants";
import { ICompany, IInvoice } from "@/interfaces";
import { invoiceFormSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { Building2Icon } from "lucide-react";
import Image from "next/image";

import { createInvoice, updateInvoice } from "@/lib/actions/invoice.actions";

import CreateCompanyPopUp from "../others/CreateCompanyPopUp";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type InvoiceFormProps = {
  companies?: ICompany[];
  reception_id?: number;
  invoice_id?: number;
  invoice?: IInvoice;
  type: "Create" | "Update";
};

export default function InvoiceForm({
  companies,
  reception_id,
  type,
  invoice_id,
  invoice,
}: InvoiceFormProps) {
  const router = useRouter();

  const defaultValues =
    invoice && type === "Update" ? invoice : invoiceDefaultValues;
  const form = useForm<z.infer<typeof invoiceFormSchema>>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues,
  });

  async function onSubmit(values: z.infer<typeof invoiceFormSchema>) {
    const invoice = {
      trace_code: values.trace_code,

      total_weight: values.total_weight,
      company_id: values.company_id,
    };

    if (type === "Create" && reception_id) {
      try {
        const response = await createInvoice({
          invoice,
          reception_id: reception_id,
          path: "/invoice/reception-weights",
        });

        if (response) {
          form.reset();
          toast.success("créé avec succès");
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (type === "Update" && invoice_id) {
      const response = await updateInvoice({
        invoice: { ...invoice, id: invoice_id },

        path: "/invoice/reception-weights",
      });
      if (response) {
        toast.success("Modifier avec succès");
        router.back();
        form.reset();
      }
    }
  }

  const handleSelectCpmpany = async (id: number) => {
    form.setValue("company_id", id);
  };
  return (
    <section>
      <Form {...form}>
        <div className="flex flex-col gap-8 w-full md:w-[360px]">
          <div className="flex flex-col gap-4 lg:gap-6 ">
            {" "}
            <FormField
              control={form.control}
              name="company_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="p-1 text-lg flex gap-3 capitalize  text-gray-700">
                    <Building2Icon width={25} className="text-[#3354f4]" />
                    Marayeur
                  </FormLabel>

                  <div className="flex items-center justify-between">
                    <FormControl className="">
                      <Select
                        {...field}
                        value={String(field?.value || "")}
                        onValueChange={(value: string) => field.onChange(value)}
                      >
                        <SelectTrigger
                          tabIndex={3}
                          className={` w-full cursor-pointer rounded-none rounded-l-lg  py-6 px-4 !text-lg font-semibold`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="font-semibold  ">
                          {companies?.length === 0 && (
                            <div className="w-full h-20 flex items-center justify-center text-gray-500 font-semibold">
                              Aucun marayeur
                            </div>
                          )}
                          {companies?.map((company) => {
                            return (
                              <SelectItem
                                className="text-lg"
                                key={company.id}
                                value={String(company.id)}
                              >
                                {company.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <CreateCompanyPopUp
                      handleSelectCpmpany={handleSelectCpmpany}
                    />
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trace_code"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="p-1 text-lg flex gap-3 capitalize  text-gray-700">
                    <div className="relative w-[30px] h-[30px]">
                      {" "}
                      <Image
                        src="/icons/numbers.svg"
                        alt="numbers"
                        fill
                        className="object-contain text-[#3354f4]"
                      />
                    </div>
                    Numéro de traçabilité
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full py-6 px-4 font-semibold capitalize !text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="total_weight"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="p-1 text-lg flex gap-2 capitalize    text-gray-700">
                    <div className="relative w-[35px] h-[35px]">
                      {" "}
                      <Image
                        src="/icons/quantity.svg"
                        alt="numbers"
                        fill
                        className="object-contain text-[#3354f4]"
                      />
                    </div>
                    Quantité
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="input-field py-6 px-4 !text-lg font-semibold"
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
            disabled={form.formState.isSubmitting}
            className="button col-span-2 text-lg  w-fit mx-auto bg-[#3354f4] cursor-pointer hover:bg-blue-700"
          >
            {form.formState.isSubmitting
              ? "Soumission..."
              : type === "Create"
              ? `Créer Traçabilité`
              : `Modifier Traçabilité`}
          </Button>
        </div>
      </Form>
    </section>
  );
}
