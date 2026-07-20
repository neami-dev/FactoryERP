"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ICategory } from "@/interfaces";
import { categoryFormSchema } from "@/lib/validator";
import {
  categoryNameExists,
  createCategory,
  updateCategory,
} from "@/lib/actions/fishCategory.actions";
import { useState } from "react";

import { Input } from "../ui/input";
import Image from "next/image";
import { Button } from "../ui/button";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

type FishFormpropos = {
  type: "Create" | "Update";
  fishCategory?: ICategory;
  fishCategoryId?: number;
};
export default function FishForm({
  type,
  fishCategory,
  fishCategoryId,
}: FishFormpropos) {
  const [img, setImg] = useState<File | null>(null);
  const router = useRouter();

  const defaultValues =
    fishCategory && type === "Update"
      ? fishCategory
      : {
          name: "",
        };

  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
  });

  async function onSubmit(values: z.infer<typeof categoryFormSchema>) {
    const exists = await categoryNameExists({
      name: values.name,
      id: fishCategoryId,
    });

    if (exists) {
      return form.setError("name", {
        message: "Ce nom de catégorie existe déjà.",
      });
    }
    if (!img) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.setError("img" as any, {
        type: "manual",
        message: "L'image est requise.",
      });
      return;
    }
    const arrayBuffer = await img.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    if (type === "Create") {
      try {
        const response = await createCategory({
          category: {
            name: values.name,
            img: uint8Array,
          },
          path: "/dashboard/fish-category",
        });

        if (response) {
          form.reset();
          setImg(null);
          toast.success("créé avec succès");
          router.push(`/dashboard/fish-category/${response.data?.id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (type === "Update" && fishCategoryId) {
      const response = await updateCategory({
        category: { name: values.name, img: uint8Array, id: fishCategoryId },
        path: "/dashboard/fish-category",
      });
      if (response) {
        router.push(`/dashboard/fish-category/${fishCategoryId}`);
        toast.success("Modifier avec succès");
        setImg(null);
        form.reset();
      }
    }
  }

  return (
    <section>
      <Form {...form}>
        <div className="flex flex-col gap-8 w-full px-4 md:w-[360px]">
          <div className="flex flex-col gap-4 lg:gap-6 ">
            {" "}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="p-1 text-lg flex gap-3 capitalize  text-gray-700">
                    <div className="relative w-[24px] h-[24px]  md:w-[30px] md:h-[30px]">
                      {" "}
                      <Image
                        src="/icons/fish-10.svg"
                        alt="numbers"
                        fill
                        className="object-contain text-[#3354f4]"
                      />
                    </div>
                    Nom
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      className="w-full py-5 md:py-6 px-4 font-semibold !text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="img"
              render={() => (
                <FormItem className="w-full relative">
                  <FormLabel className="p-1 text-lg flex gap-3 capitalize  text-gray-700">
                    <div className="relative w-[24px] h-[24px]  md:w-[26px] md:h-[30px]">
                      {" "}
                      <Image
                        src="/icons/add-image-photo.svg"
                        alt="numbers"
                        fill
                        className="object-contain text-[#3354f4]"
                      />
                    </div>
                    Image
                  </FormLabel>{" "}
                  <Image
                    src={"/icons/sample-add.svg"}
                    width={30}
                    height={30}
                    alt=""
                    className=" opacity-70 absolute top-22 left-1/2 -translate-x-1/2"
                  />
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      defaultValue={img?.name as string}
                      onChange={(e) => {
                        // @typescript-eslint/no-unused-expressions
                        const file = e.target.files?.[0] || null;
                        if (file) {
                          setImg(file);
                        }
                      }}
                      className="w-full h-[140px]  z-20 cursor-pointer py-18 pl-14 border-2 border-dashed border-gray-300 rounded-lg    focus:ring-blue-500 focus:border-blue-500"
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
              ? `Créer Poissons`
              : `Modifier Poissons`}
          </Button>
        </div>
      </Form>
    </section>
  );
}
