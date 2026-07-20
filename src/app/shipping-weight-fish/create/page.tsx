import Header from "@/components/others/Header";
import {
  getAllCategories,
  getCategoryById,
} from "@/lib/actions/fishCategory.actions";
import { notFound } from "next/navigation";
import { getWrappingWeightTypesByCategory } from "@/lib/actions/wrappingWeightType.actions";
import { getShippingById } from "@/lib/actions/shipping.actions";
import { getShippingFishCategoryById } from "@/lib/actions/shippingFishCategory.actions";
import ShippingWeightFishForm from "@/components/Shipping/ShippingWeightFishForm";
import { getAllQualities } from "@/lib/actions/quality.actions";
import { getLastShippingWeightFish } from "@/lib/actions/shippingWeightFish.actions";
import LastAddedWeight from "@/components/Shipping/LastAddedWeight";
import { palletsNotValidatedInShipping } from "@/lib/actions/pallet.actions";

import Image from "next/image";
import Link from "next/link";
import FinishShippingWeight from "@/components/Shipping/FinishShippingWeight";
import { getTotalWeightOfStock } from "@/lib/actions/wrapping.actions";

type CreateWeightFishProps = {
  searchParams: Promise<{ shippingFishCategoryId: number }>;
};

export default async function createshippingtWeightFish({
  searchParams,
}: CreateWeightFishProps) {
  const { shippingFishCategoryId } = await searchParams;

  if (!shippingFishCategoryId) notFound();

  const shippingFishCategory = await getShippingFishCategoryById(
    shippingFishCategoryId
  );

  if (!shippingFishCategory) notFound();

  const [
    weightTypes,
    getCatgory,
    lastShippingWF,
    allQualities,
    allCategories,
    shipping,
    stock,
  ] = await Promise.all([
    getWrappingWeightTypesByCategory(
      shippingFishCategory?.fish_category_id ?? 0
    ),
    getCategoryById(shippingFishCategory?.fish_category_id ?? 0),

    getLastShippingWeightFish(shippingFishCategoryId),
    getAllQualities(),
    getAllCategories(),
    getShippingById(shippingFishCategory?.shipping_id),
    getTotalWeightOfStock()
  ]);
  if (!shipping) notFound();
  const showFinishBtn = await palletsNotValidatedInShipping(shipping.id);

  return (
    <section className="flex flex-col items-center  w-full min-h-screen">
      <Header text="Accueil" link="/" showPackIcon={true}>
        <div className="flex justify-end items-center flex-wrap gap-3">
          <Link
            href={`/shipping/${shipping.id}/details`}
            className="py-2 px-2   text-sm font-medium flex gap-3 text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100   focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700"
          >
            <Image
              src="/icons/view-list-blue.svg"
              alt=""
              width={20}
              height={20}
            />{" "}
            <p className="hidden md:block"> Valider la palette</p>
          </Link>
          {showFinishBtn && <FinishShippingWeight shippingId={shipping.id} />}
        </div>
      </Header>
      <LastAddedWeight data={lastShippingWF?.data} />

      <div className="w-full flex flex-col justify-center items-center mt-4">
        <div className="w-fit  mx-auto p-2 ">
          {/* <h2 className="md:text-2xl font-bold text-[#3354f4] text-center">
            Entrer les poids  
          </h2> */}

          <ShippingWeightFishForm
            type="Create"
            total_weight={shipping.total_weight}
            totalWeightInStock= {stock?.totalWeight}
            weight_types={weightTypes?.data}
            shipping_fish_category_id={shippingFishCategoryId}
            all_qualities={allQualities}
            fish_categories={allCategories?.data}
            get_catgory={getCatgory?.data}
            shipping_id={shipping.id}
          />
        </div>
      </div>
    </section>
  );
}
