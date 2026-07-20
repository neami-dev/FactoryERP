import Header from "@/components/others/Header";

import { getCategoryById } from "@/lib/actions/fishCategory.actions";

import Image from "next/image";
import { notFound } from "next/navigation";

import WrappingWeightFishForm from "@/components/wrapping/WrappingWeightFishForm";
import { getWrappingById } from "@/lib/actions/wrapping.actions";
import { getWrappingWeightTypesByCategory } from "@/lib/actions/wrappingWeightType.actions";
import LastAddedWeight from "@/components/wrapping/LastAddedWeight";
import {
  getLastWrappingWeightFish,
  getWWFByWrappingFish,
} from "@/lib/actions/wrappingWeightFish.actions";
import SelectWrappedReception from "@/components/wrapping/SelectWrappedReception";
import { getReceptionsByWrappingId } from "@/lib/actions/reception.actions";
import { checkWrappingToFinish } from "@/lib/actions/receptionWrapping.actions";
import FinishWrappingBtn from "@/components/wrapping/FinishWrappingBtn";
import WeightsFishWrappingTable from "@/components/wrapping/WeightsFishWrappingTable";
import { getAllQualities } from "@/lib/actions/quality.actions";
import { bufferToBase64FromObject } from "@/lib/utils";

type CreateWeightFishProps = {
  searchParams: Promise<{ wrappingId: number }>;
};
export default async function createWrappingtWeightFish({
  searchParams,
}: CreateWeightFishProps) {
  const { wrappingId } = await searchParams;

  if (!wrappingId) notFound();

  const wrapping = await getWrappingById(wrappingId);
  if (!wrapping) notFound();

  const [
    selectedWrappings,
    weightTypes,
    getCatgory,
    wWFByWrappingFish,
    lastWrappingWF,
    receptionWrappings,
    allQualities,
  ] = await Promise.all([
    checkWrappingToFinish(wrappingId),
    getWrappingWeightTypesByCategory(wrapping?.fish_category_id ?? 0),
    getCategoryById(wrapping?.fish_category_id ?? 0),
    getWWFByWrappingFish(wrappingId),
    getLastWrappingWeightFish(wrappingId),
    getReceptionsByWrappingId(wrappingId),
    getAllQualities(),
  ]);

  return (
    <section className="flex flex-col items-center  w-full min-h-screen">
      <Header text="Accueil" link="/" showPackIcon={true}>
        <div className="flex justify-end items-center flex-wrap gap-3">
          <WeightsFishWrappingTable
            data={wWFByWrappingFish?.data}
            fishName={getCatgory?.data.name || ""}
          />
          <SelectWrappedReception receptions={receptionWrappings?.data} />
          {selectedWrappings?.data?.length > 0 ? (
            <FinishWrappingBtn wrappingId={wrappingId} />
          ) : (
            ""
          )}
        </div>
      </Header>
      <LastAddedWeight data={lastWrappingWF?.data} />

      <div className="w-full h-[80%] flex flex-col justify-center items-center mt-4">
        <div className="w-fit  mx-auto p-2 ">
          <h2 className="md:text-2xl font-bold text-[#3354f4] text-center">
            Entrer les poids
          </h2>

          <div className="w-full flex flex-col justify-center items-center py-1 gap-3 ">
            {getCatgory?.data.img && (
              <Image
                src={`data:image/png;base64,${bufferToBase64FromObject(
                  getCatgory?.data.img
                )}`}
                alt={`${getCatgory?.data.name}`}
                width={70}
                height={70}
                className="rounded-xl"
                priority
              />
            )}
            <h3 className="md:text-lg font-semibold capitalize text-gray-700">
              {getCatgory?.data.name}
            </h3>
          </div>

          <WrappingWeightFishForm
            type="Create"
            weight_types={weightTypes?.data}
            wrapping_id={wrappingId}
            all_qualities={allQualities}
          />
        </div>
      </div>
    </section>
  );
}
