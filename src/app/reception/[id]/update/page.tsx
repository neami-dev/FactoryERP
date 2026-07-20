import Header from "@/components/others/Header";
import ReceptionForm from "@/components/reception/ReceptionForm";
import { getAllCategories } from "@/lib/actions/fishCategory.actions";
import { getReceptionById } from "@/lib/actions/reception.actions";
import { getAllSuppliers } from "@/lib/actions/supplier.action";
import React from "react";
type UpdateReceptionProps = {
  params: Promise<{ id: number }>;
};
export default async function updateRecetion({ params }: UpdateReceptionProps) {
  const { id } = await params;

  const reception = await getReceptionById(id);
  const suppliers = await getAllSuppliers();
  const allCategories = await getAllCategories();
  const weigher_id = 1;

  return (
    <section className="flex flex-col items-center h-screen">
      <Header text="" showPackIcon={true} />
      <section className="flex flex-col items-center justify-center h-full ">
        <div className="px-4 mx-auto">
          <h2 className="text-xl lg:text-2xl font-bold text-[#3354f4] py-4 text-center">
            Modifier la réception
          </h2>
          <ReceptionForm
            reception={reception}
            reception_id={reception?.id}
            weigher_id={weigher_id}
            suppliers={suppliers?.data}
            categories={allCategories?.data}
            type="Update"
          />
        </div>
      </section>
    </section>
  );
}
