import FishInfo from "@/components/FishCategories/FishInfo";
import WeightTypes from "@/components/FishCategories/WeightTypes";
import WrappingWeightTypes from "@/components/FishCategories/WrappingWeightTypes";

import { Button } from "@/components/ui/button";
import { getCategoryById } from "@/lib/actions/fishCategory.actions";
import { XIcon } from "lucide-react";

import Link from "next/link";

type CategoryDetailsProps = {
  params: Promise<{ id: number }>;
};
export default async function CategoryDetails({
  params,
}: CategoryDetailsProps) {
  const { id } = await params;

  const response = await getCategoryById(id);

  if (!response?.data) {
    return (
      <div className="w-full h-full flex justify-center items-center flex-col">
        <h2 className="text-2xl text-[#3354f4] text-center font-semibold py-16">
          Aucune catégorie trouvée
        </h2>
        <Link href="/dashboard/fish-category">
          <Button variant="secondary">Retour</Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="w-full  relative flex justify-center items-center flex-col">
      <Link
        href={"/dashboard/fish-category"}
        className=" cursor-pointer absolute top-9 right-5 lg:right-15 xl:right-[220px]  bg-red-600 rounded-md p-1 text-white hover:bg-red-700"
      >
        <XIcon className="w-[24px] h-[24px]  md:w-[30px] md:h-[30px]  " />
      </Link>
      <h2 className="text-2xl  text-[#3354f4] text-center font-semibold py-16">
        Details de la catégorie
      </h2>

      {response?.data && <FishInfo data={response?.data} />}
      {response?.data?.weight_type && (
        <WeightTypes
          weight_type={response?.data?.weight_type}
          fishCategoryId={response.data.id}
        />
      )}
      {response?.data?.wrapping_weight_type && (
        <WrappingWeightTypes
          wrapping_weight_type={response?.data?.wrapping_weight_type}
          fishCategoryId={response.data.id}
        />
      )}
    </div>
  );
}
