import Header from "@/components/others/Header";
import ShippingCard from "@/components/Shipping/ShippingCard";

import { getAllInfoOfPalletsByShipId } from "@/lib/actions/pallet.actions";
type ShippingProps = {
  params: Promise<{ id: number }>;
};
export default async function page({ params }: ShippingProps) {
  const { id } = await params;
  const allpallets = await getAllInfoOfPalletsByShipId(id);

  const transformedData = allpallets?.map((pallet) => {
    const numberOfBoxes =
      pallet.shipping_weight_fish?.reduce((sum, item) => sum + item.box, 0) ??
      0;
    const weight =
      pallet.shipping_weight_fish?.reduce(
        (sum, item) => sum + item.weight,
        0
      ) ?? 0;

    return {
      pallet_id: pallet.id,
      numberOfBoxes,

      weight,
      palletNumber: String(pallet.pallet_number),
      isValidated: pallet.is_validated,
      fishCategories: [
        ...new Set(
          pallet.shipping_weight_fish
            ?.map(
              (shipping_weight) =>
                shipping_weight.shipping_Fish_category?.fish_category?.name
            )
            .filter((name): name is string => typeof name === "string")
        ),
      ],
    };
  });

  return (
    <section>
      <Header showPackIcon={true} text=""></Header>
      <h2 className="md:text-2xl py-8 font-bold text-[#3354f4] text-center">
        Palettes d&apos;expédition ({id})
      </h2>
      <div className="flex flex-wrap gap-4 w-full   mx-auto justify-center items-center ">
        {/* <ShowPallets /> */}
        {transformedData &&
          transformedData.map((data, i) => {
            return <ShippingCard key={i} data={data} />;
          })}
      </div>
    </section>
  );
}
