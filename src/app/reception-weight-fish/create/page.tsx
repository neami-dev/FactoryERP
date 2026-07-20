import FinishRecBtn from "@/components/recpetionWeightFish/FinishRecBtn";
import Header from "@/components/others/Header";
import InvoicePopUp from "@/components/invoice/InvoicePopUp";
import LastAddedWeight from "@/components/recpetionWeightFish/LastAddedWeight";
import ReceptionWeightFishForm from "@/components/recpetionWeightFish/ReceptionWeightFishForm";
import WeightsFishTable from "@/components/recpetionWeightFish/WeightsFishTable";
import { getCategoryById } from "@/lib/actions/fishCategory.actions";
import { getReceptionById } from "@/lib/actions/reception.actions";
import {
  getLastReceptionWeightFish,
  getRWFByReceptionFish,
} from "@/lib/actions/receptionWeightFish.actions";

import Image from "next/image";
import { notFound } from "next/navigation";

import { getAllQualities } from "@/lib/actions/quality.actions";
import { getWeightTypesByCategory } from "@/lib/actions/weightTypes.actions";
import { bufferToBase64FromObject } from "@/lib/utils";

type CreateWeightFishProps = {
  searchParams: Promise<{ receptionId: number }>;
};
export default async function createReceptionWeightFish({
  searchParams,
}: CreateWeightFishProps) {
  const { receptionId } = await searchParams;

  if (!receptionId) notFound();

  const reception = await getReceptionById(receptionId);
  const weightTypes = await getWeightTypesByCategory(
    reception?.fish_category_id ?? 0
  );
  if (!reception) return;

  const [lastReceptionWF, getRepetionWeightsFish, getCatgory, allQualities] =
    await Promise.all([
      getLastReceptionWeightFish(receptionId),
      getRWFByReceptionFish(receptionId),
      getCategoryById(reception?.fish_category_id),
      getAllQualities(),
    ]);
  return (
    <section className="flex flex-col items-center  w-full min-h-screen">
      <Header text="Accueil" link="/" showPackIcon={true}>
        <div className="flex justify-end items-center flex-wrap gap-3">
          <WeightsFishTable
            data={getRepetionWeightsFish?.data}
            fishName={getCatgory?.data.name || ""}
          />
          <InvoicePopUp reception={reception} />

          {((reception?.invoices?.length ?? 0) > 0 ||
            reception?.invoiceStatus === "HAVENOT") && (
            <FinishRecBtn receptionId={receptionId} />
          )}
        </div>
      </Header>
      <LastAddedWeight data={lastReceptionWF?.data} />

      <div className="w-full h-[80%] flex flex-col justify-center items-center mt-4">
        <div className="w-fit  mx-auto p-2 ">
          <h2 className="text-2xl font-bold text-[#3354f4] text-center">
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
            <h3 className="text-lg font-semibold capitalize text-gray-700">
              {getCatgory?.data.name}
            </h3>
          </div>
          <ReceptionWeightFishForm
            type="Create"
            weight_types={weightTypes?.data}
            reception_id={receptionId}
            all_qualities={allQualities}
          />
        </div>
      </div>
    </section>
  );
}
