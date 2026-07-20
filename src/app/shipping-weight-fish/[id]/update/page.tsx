import Header from "@/components/others/Header";
import ShippingWeightFishForm from "@/components/Shipping/ShippingWeightFishForm";
import {
  getAllCategories,
  getCategoryById,
} from "@/lib/actions/fishCategory.actions";
import { getAllQualities } from "@/lib/actions/quality.actions";

import { getShippingWeightFish } from "@/lib/actions/shippingWeightFish.actions";
import { getWrappingWeightTypesByCategory } from "@/lib/actions/wrappingWeightType.actions";
import React from "react";
type props = {
  params: Promise<{ id: number }>;
};
export default async function page({ params }: props) {
  const { id } = await params;
  const shippingWeightFish = await getShippingWeightFish(id);

  const [weightTypes, getCatgory, allCategories, allQualities] =
    await Promise.all([
      getWrappingWeightTypesByCategory(
        shippingWeightFish?.shipping_Fish_category?.fish_category_id ?? 0
      ),
      getCategoryById(
        shippingWeightFish?.shipping_Fish_category?.fish_category_id ?? 0
      ),
      getAllCategories(),
      getAllQualities(),
      // shipping
      // getShippingById(shippingWeightFish?.shipping_id ?? 0),
    ]);
  return (
    <section>
      <Header showPackIcon={true} text=""></Header>
      <div className="w-full   flex flex-col justify-center items-center">
        <div className="w-fit  mx-auto p-2 ">
          <h2 className="md:text-2xl font-bold py-12 text-[#3354f4] text-center">
            Entrer les poids
          </h2>

          <ShippingWeightFishForm
            type="Update"
            shipping_weight_fish={shippingWeightFish}
            shipping_weight_fish_id={shippingWeightFish?.id}
            weight_types={weightTypes?.data}
            shipping_fish_category_id={
              shippingWeightFish?.shipping_Fish_category_id
            }
            all_qualities={allQualities}
            fish_categories={allCategories?.data}
            get_catgory={getCatgory?.data}
          />
        </div>
      </div>
    </section>
  );
}
