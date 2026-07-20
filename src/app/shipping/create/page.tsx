import Header from "@/components/others/Header";
import ShippingForm from "@/components/Shipping/ShippingForm";
import { getAllClients } from "@/lib/actions/client.actions";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function CreateShipping() {
  
  const [clients, session] = await Promise.all([
    getAllClients(),
    getServerSession(authOptions),
  ]);
  const weigher_id = Number(session?.user.id);

  return (
    <section className="flex flex-col items-center h-screen">
      <Header text="" showPackIcon={true} />
      <section className="flex flex-col items-center justify-center h-full ">
        <div className="px-4 mx-auto">
          <h2 className="text-xl lg:text-2xl font-bold text-[#3354f4] py-8 text-center">
            Informations d&apos;expédition
          </h2>
          <ShippingForm
            weigher_id={weigher_id}
            clients={clients?.data}
            type="Create"
          />
        </div>
      </section>
    </section>
  );
}
