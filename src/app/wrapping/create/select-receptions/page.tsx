import Header from "@/components/others/Header";

import SelectReceptionTable from "@/components/wrapping/SelectReceptionTable";
import { getReceptionsNotWrapped } from "@/lib/actions/reception.actions";

import { getWrappingById } from "@/lib/actions/wrapping.actions";

import { notFound } from "next/navigation";

import React from "react";
type SelectReceptionProps = {
  searchParams: Promise<{ wrappingId: number }>;
};
export default async function SelectReception({
  searchParams,
}: SelectReceptionProps) {
  const { wrappingId } = await searchParams;
  if (!wrappingId) return notFound();
  const wrapping = await getWrappingById(wrappingId);

  if (!wrapping) return notFound();

  const receptionWrapped = await getReceptionsNotWrapped({
    fishCategoryId: wrapping?.fish_category_id,
  });

  return (
    <div>
      <Header text="Accueil" showPackIcon={true} link="/" />
      <section className="flex w-full flex-col  py-3 px-2 items-center justify-center">
        <div className="relative w-full lg:w-[90%] 2xl:w-[70%] flex flex-col justify-between items-center py-6">
          <h2 className=" text-xl lg:text-2xl font-semibold py-3 lg:py-6  text-[#3354f4]">
            Poids disponible - {" "}
            <span className="text-black capitalize">{wrapping?.fish_category?.name}</span>
          </h2>
        </div>
        <SelectReceptionTable
          wrappingId={wrappingId}
          receptions={receptionWrapped}
          fishCategoryId={wrapping?.fish_category_id}
        />
      </section>
    </div>
  );
}
