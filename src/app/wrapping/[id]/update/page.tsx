import Header from "@/components/others/Header";

import WrappingForm from "@/components/wrapping/WrappingForm";
import { getAllClients } from "@/lib/actions/client.actions";

import { getAllCategories } from "@/lib/actions/fishCategory.actions";
import { getWrappingById } from "@/lib/actions/wrapping.actions";
type UpdateWrappingProps = {
  params: Promise<{ id: number }>;
};
export default async function UpdateWrapping({ params }: UpdateWrappingProps) {
  const { id } = await params;
  const clients = await getAllClients();
  const allCategories = await getAllCategories();
  const wrapping = await getWrappingById(id);

  return (
    <section className="flex flex-col items-center h-screen">
      <Header text="" showPackIcon={true} />
      <section className="flex flex-col items-center justify-center h-full ">
        <div className="px-4 mx-auto">
          <h2 className="text-xl lg:text-2xl font-bold text-[#3354f4] py-8 text-center">
            Informations de Emballage
          </h2>
          <WrappingForm
            clients={clients?.data}
            categories={allCategories?.data}
            type="Update"
            wrapping={wrapping}
            weigher_id={wrapping?.id}
          />
        </div>
      </section>
    </section>
  );
}
