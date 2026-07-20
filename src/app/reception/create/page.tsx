import Header from "@/components/others/Header";
import ReceptionForm from "@/components/reception/ReceptionForm";

import { getAllCategories } from "@/lib/actions/fishCategory.actions";
import { getAllSuppliers } from "@/lib/actions/supplier.action";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
type CreateRecptionProps = {
  searchParams: Promise<{ isTraceability?: boolean }>;
};
export default async function CreateRecption({
  searchParams,
}: CreateRecptionProps) {
  const { isTraceability } = await searchParams;
  const [suppliers, allCategories, session] = await Promise.all([
    getAllSuppliers(),
    getAllCategories(),
    getServerSession(authOptions),
  ]);
  const weigher_id = Number(session?.user.id);

  return (
    <section className="flex flex-col items-center h-screen">
      <Header text="" showPackIcon={true} />
      <section className="flex flex-col items-center justify-center h-full ">
        <div className="px-4 mx-auto">
          <h2 className="text-xl lg:text-2xl font-bold text-[#3354f4] py-4 text-center">
            Informations de réception
          </h2>
          <ReceptionForm
            weigher_id={weigher_id}
            suppliers={suppliers?.data}
            categories={allCategories?.data}
            type="Create"
            isTraceability={isTraceability}
          />
        </div>
      </section>
    </section>
  );
}
