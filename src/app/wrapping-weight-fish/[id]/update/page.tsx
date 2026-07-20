import Header from "@/components/others/Header";

import { getCategoryById } from "@/lib/actions/fishCategory.actions";

import Image from "next/image";
import { notFound } from "next/navigation";

import WrappingWeightFishForm from "@/components/wrapping/WrappingWeightFishForm";
import { getWrappingById } from "@/lib/actions/wrapping.actions";
import { getWrappingWeightTypesByCategory } from "@/lib/actions/wrappingWeightType.actions";

import { getWrappingWFById } from "@/lib/actions/wrappingWeightFish.actions";
import SelectWrappedReception from "@/components/wrapping/SelectWrappedReception";
import { getReceptionsByWrappingId } from "@/lib/actions/reception.actions";
import { bufferToBase64FromObject } from "@/lib/utils";
import { getAllQualities } from "@/lib/actions/quality.actions";

type UpdateWeightFishProps = {
  params: Promise<{ id: number }>;
};
export default async function updateWrappingtWeightFish({
  params,
}: UpdateWeightFishProps) {
  const { id } = await params;

  const wrappingWF = await getWrappingWFById(id);
  if (!wrappingWF?.data.wrapping_id) notFound();
  const wrapping = await getWrappingById(wrappingWF?.data.wrapping_id);
  const wrappingId = wrapping?.id;

  if (!wrappingId) notFound();

  const [weightTypes, getCatgory, receptionWrappings,allQualities] = await Promise.all([
    getWrappingWeightTypesByCategory(wrapping?.fish_category_id ?? 0),
    getCategoryById(wrapping?.fish_category_id ?? 0),
    getReceptionsByWrappingId(wrappingId),
    getAllQualities(),
  ]);

  return (
    <section className="flex flex-col items-center  w-full min-h-screen">
      <Header text="Accueil" link="/" showPackIcon={true}>
          <SelectWrappedReception receptions={receptionWrappings?.data} />
      </Header>

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
            type="Update"
            weight_types={weightTypes?.data}
            wrapping_id={wrappingId}
            wrapping_weight_fish={wrappingWF.data}
            wrapping_weight_fish_id={wrappingWF.data.id}
            all_qualities={allQualities}
          />
        </div>
      </div>
    </section>
  );
}
