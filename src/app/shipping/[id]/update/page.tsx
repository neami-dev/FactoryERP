import Header from "@/components/others/Header";
import ShippingForm from "@/components/Shipping/ShippingForm";
import { getAllClients } from "@/lib/actions/client.actions";
import { getShippingById } from "@/lib/actions/shipping.actions";
type ShippingProps = {
  params: Promise<{ id: number }>;
};
export default async function UpdateShipping({ params }: ShippingProps) {
  const clients = await getAllClients();
  const { id } = await params;
  const shipping = await getShippingById(id);

  return (
    <section className="flex flex-col items-center h-screen">
      <Header text="" showPackIcon={true} />
      <section className="flex flex-col items-center justify-center h-full ">
        <div className="px-4 mx-auto">
          <h2 className="text-xl lg:text-2xl font-bold text-[#3354f4] py-8 text-center">
            Modifier l&apos;expédition
          </h2>
          <ShippingForm
            clients={clients?.data}
            type="Update"
            shipping={shipping}
            shipping_id={shipping?.id}
          />
        </div>
      </section>
    </section>
  );
}
