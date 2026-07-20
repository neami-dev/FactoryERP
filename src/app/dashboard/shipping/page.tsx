import { ShippingColums } from "@/components/Shipping/ShippingColums";
import { ShippingTable } from "@/components/Shipping/ShippingTable";
import { getAllShippings } from "@/lib/actions/shipping.actions";

export default async function page() {
  const allShippings = await getAllShippings({});

  return (
    <div>
      <ShippingTable data={allShippings} columns={ShippingColums} />
    </div>
  );
}
