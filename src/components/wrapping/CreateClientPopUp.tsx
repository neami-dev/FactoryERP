"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { User, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supplierFormSchema } from "@/lib/validator";
import { z } from "zod";
 
import { createClient } from "@/lib/actions/client.actions";

export default function CreateClientPopUp({
  handleSelectClient,
}: {
  handleSelectClient: (id: number) => void;
}) {
  const [show, setShow] = useState(false);
  const form = useForm<z.infer<typeof supplierFormSchema>>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
    },
  });

  async function onSubmit(values: z.infer<typeof supplierFormSchema>) {
    try {
      const newClient = await createClient({
        client: {
          firstname: values.firstname,
          lastname: values.lastname,
          role_id: 1,
        },

        path: "/reception/create",
      });

      if (newClient) {
        form.reset();
        setShow(false);
        handleSelectClient(newClient.id);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <Button
        onClick={() => setShow(!show)}
        className=" bg-blue-600 cursor-pointer hover:bg-blue-700 w-[50px] h-[42px] rounded-none rounded-r-lg"
      >
        <UserPlus width={40} />
      </Button>
      {show && (
        <section className="flex flex-col items-center justify-center absolute   h-screen bg-black/20 w-full top-0 left-0 z-10">
          {" "}
          <div className="bg-white relative w-xl py-6 border-2xl rounded-lg shadow-lg flex flex-col items-center justify-center gap-5 ">
            <h1 className="text-2xl font-semibold text-center p-5 text-blue-600">
              Information de client{" "}
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
                    name="firstname"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="p-1 text-base flex gap-3 capitalize  text-gray-700">
                          <User width={25} className="text-[#3354f4]" />
                          prénom
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Prénom"
                            {...field}
                            className="min-w-xs py-5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="p-1 text-base flex gap-3 capitalize  text-gray-700">
                          <User width={25} className="text-[#3354f4]" />
                          nom
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nom"
                            {...field}
                            className="min-w-xs py-5"
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
                  {/* {form.formState.isSubmitting
                        ? "Soumission..."
                        : `créer Réception`} */}
                  créer client
                </Button>
              </Form>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
