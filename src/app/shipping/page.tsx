import Header from "@/components/others/Header";

import WrappingForm from "@/components/wrapping/WrappingForm";
import { getAllClients } from "@/lib/actions/client.actions";

import { getAllCategories } from "@/lib/actions/fishCategory.actions";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function CreateShipping() {
  const clients = await getAllClients();
  const allCategories = await getAllCategories();
  const session = await getServerSession(authOptions);
  const weigher_id = Number(session?.user.id);

  return (
    <section className="flex flex-col items-center h-screen">
      <Header text="" showPackIcon={true} />
      <section className="flex flex-col items-center justify-center h-full ">
        <div className="px-4 mx-auto">
          <h2 className="text-xl lg:text-2xl font-bold text-[#3354f4] py-8 text-center">
            Informations de Emballage
          </h2>
          <WrappingForm
            weigher_id={weigher_id}
            clients={clients?.data}
            categories={allCategories?.data}
            type="Create"
          />
        </div>
      </section>
    </section>
  );
}
