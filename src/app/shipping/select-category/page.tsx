"use client";
import FishSelection from "@/components/others/FishSelection";
import Header from "@/components/others/Header";
import { ICategory } from "@/interfaces";
import { getAvailableFishCategoriesForShipping } from "@/lib/actions/fishCategory.actions";
import { createShippingFishCategory } from "@/lib/actions/shippingFishCategory.actions";
import { notFound, useRouter, useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SelectCategory() {
  const searchParams = useSearchParams();
  const shippingId = searchParams.get("shippingId");
  const [categories, setCategories] = useState<ICategory[]>();
  const router = useRouter();
  if (!shippingId) notFound();
  useEffect(() => {
    getAvailableFishCategoriesForShipping(Number(shippingId)).then((res) =>
      setCategories(res)
    );
  }, [shippingId]);

  const handleSelectedId = async (id: number) => {
    createShippingFishCategory({
      data: { fish_category_id: id, shipping_id: Number(shippingId) },
      path: "",
    }).then((res) => {
      toast.success("créé avec succès");
      router.push(
        `/shipping-weight-fish/create?shippingFishCategoryId=${res?.id}`
      );
    });
  };
  return (
    <div className="w-full ">
      <Header showPackIcon={true} text="" />
      <div className="flex flex-col gap-8 pt-8 lg:pt-18 justify-center items-center">
        <h2 className="text-xl lg:text-2xl font-bold text-[#3354f4] py-4 text-center">
          Sélectionnez un Espace
        </h2>
        <FishSelection
          fishcategories={categories}
          handleSelectedId={handleSelectedId}
        />
      </div>
    </div>
  );
}
