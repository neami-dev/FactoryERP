import Header from "@/components/others/Header";
import ReceptionWeightFishForm from "@/components/recpetionWeightFish/ReceptionWeightFishForm";
import { getCategoryById } from "@/lib/actions/fishCategory.actions";
import { getAllQualities } from "@/lib/actions/quality.actions";
import { getReceptionById } from "@/lib/actions/reception.actions";
import { getReceptionWFById } from "@/lib/actions/receptionWeightFish.actions";
import { getWeightTypesByCategory } from "@/lib/actions/weightTypes.actions";
import { bufferToBase64FromObject } from "@/lib/utils";
import Image from "next/image";
import { notFound } from "next/navigation";

type UpdateReceptionWeightFishProps = {
  params: Promise<{ id: number }>;
};

export default async function page({ params }: UpdateReceptionWeightFishProps) {
  const { id } = await params;

  if (!id) notFound();
  const receptioWF = await getReceptionWFById(id);

  if (!receptioWF) return;

  const weightTypes = await getWeightTypesByCategory(
    receptioWF?.data.reception?.fish_category_id ?? 0
  );
  if (!receptioWF.data.reception?.id) return;
  const reception = await getReceptionById(receptioWF.data.reception?.id);

  if (!reception) return false;
  const getCategory = await getCategoryById(
    receptioWF?.data.reception?.fish_category_id ?? 0
  );
  const allQualities = await getAllQualities();

  return (
    <div className="w-full h-[80%] flex flex-col justify-center items-center ">
      <Header showPackIcon={true} text="" />
      <div className="w-fit  mx-auto py-3 ">
        <h2 className="text-2xl py-3 font-bold text-[#3354f4] text-center">
          Entrer les poids
        </h2>

        <div className="w-full flex flex-col justify-center items-center py-1 gap-3 ">
          {getCategory?.data.img && (
            <Image
              src={`data:image/png;base64,${bufferToBase64FromObject(
                getCategory?.data.img
              )}`}
              alt={`${getCategory?.data.name}`}
              width={70}
              height={70}
              className="rounded-xl"
              priority
            />
          )}
          <h3 className="text-lg font-semibold capitalize text-gray-700">
            {getCategory?.data.name}
          </h3>
        </div>
        <ReceptionWeightFishForm
          type="Update"
          weight_types={weightTypes?.data || []}
          reception_id={id}
          reception_weight_fish={receptioWF?.data}
          reception_weight_fish_id={receptioWF?.data.id}
          all_qualities={allQualities}
        />
      </div>
    </div>
  );
}
