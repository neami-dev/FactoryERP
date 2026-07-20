"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Building2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { campanyFormSchema } from "@/lib/validator";
import { z } from "zod";

import Image from "next/image";
import { createCampany } from "@/lib/actions/company.actions";

export default function CreateCompanyPopUp({
  handleSelectCpmpany,
}: {
  handleSelectCpmpany: (id: number) => void;
}) {
  const [show, setShow] = useState(false);
  const form = useForm<z.infer<typeof campanyFormSchema>>({
    resolver: zodResolver(campanyFormSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof campanyFormSchema>) {
    try {
      const newCompany = await createCampany({
        company: values,
        path: "/reception-weight-fish/create",
      });

      if (newCompany) {
        form.reset();
        setShow(false);
        handleSelectCpmpany(newCompany.id);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <Button
        onClick={() => {
          setTimeout(() => setShow(true), 150); // delay to allow dropdown to blur
        }}
        className=" bg-blue-600 hover:bg-blue-700 w-[50px] h-[49px] rounded-none rounded-r-lg"
      >
        <div className="relative w-[35px] h-[35px]">
          {" "}
          <Image
            src="/icons/add-company.svg"
            alt="numbers"
            fill
            className="object-contain text-[#3354f4]"
          />
        </div>
      </Button>
      {show && (
        <section className="flex flex-col items-center justify-center absolute   h-screen bg-black/20 w-full top-0 left-0 z-10">
          {" "}
          <div className="bg-white relative w-xl py-6 border-2xl rounded-lg shadow-lg flex flex-col items-center justify-center gap-5 ">
            <h1 className="text-2xl font-semibold text-center p-5 text-blue-600">
              Information de Marayeur{" "}
            </h1>
            <div className="flex items-center justify-center w-full">
              <Button
                onClick={() => setShow(!show)}
                className="absolute top-3 right-3 text-xl cursor-pointer bg-red-500 hover:bg-red-600"
              >
                X
              </Button>
            </div>
            <div className="flex flex-col gap-5">
              <Form {...form}>
                <div className="flex flex-col gap-5 ">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="p-1 text-base flex gap-3 capitalize  text-gray-700">
                          <Building2Icon
                            width={25}
                            className="text-[#3354f4]"
                          />
                          name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="min-w-xs py-5 !text-lg font-medium text-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="p-1 text-base flex gap-3 capitalize  text-gray-700">
                          <div className="relative w-[30px] h-[30px]">
                            {" "}
                            <Image
                              src="/icons/numbers.svg"
                              alt="numbers"
                              fill
                              className="object-contain text-[#3354f4]"
                            />
                          </div>
                          code
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="min-w-xs py-5 !text-lg font-medium text-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  type="submit"
                  size="lg"
                  disabled={form.formState.isSubmitting}
                  className="button col-span-2 mt-5  w-fit mx-auto bg-[#3354f4] cursor-pointer hover:bg-blue-700"
                >
                  cree Marayeur
                </Button>
              </Form>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
