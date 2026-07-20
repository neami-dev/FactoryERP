import ReceptionInfostable from "@/components/invoice/ReceptionInfostable";
import Header from "@/components/others/Header";
import WieghtsTypeTable from "@/components/recpetionWeightFish/WeightTypeTable";
import { getReceptionById } from "@/lib/actions/reception.actions";
import { getWeightsByTypesAndreception } from "@/lib/actions/receptionWeightFish.actions";
import { notFound } from "next/navigation";

type ReceptionWeightFishProps = {
  searchParams: Promise<{ receptionId: number; typeName: string }>;
};
export default async function receptionWeightFish({
  searchParams,
}: ReceptionWeightFishProps) {
  const { receptionId, typeName } = await searchParams;
  if (!receptionId && !typeName) notFound();
  const reception = await getReceptionById(receptionId);
  const weightTypesdata = await getWeightsByTypesAndreception({
    receptionId,
    type: typeName,
  });

  return (
    <section className="flex flex-col w-full min-h-screen">
      <Header
        text="Tous les poids de réception"
        link={`/invoice/reception-weights?receptionId=${receptionId}`}
        showPackIcon={true}
      />
      <section className=" w-full min-h-screen flex flex-col items-center ">
        <div className="px-4 mx-auto w-full">
          <h2 className="text-base lg:text-2xl font-bold text-[#3354f4] py-4 text-center">
            Informations de Taille ({" "}
            <span className="text-black">{typeName}</span> )
          </h2>
        </div>

        <div className="relative w-full xl:w-fit overflow-x-auto mx-auto pt-3">
          <ReceptionInfostable reception={reception} />
        </div>
        <WieghtsTypeTable
          receptionId={receptionId}
          weightType={typeName}
          weightTypesdata={weightTypesdata}
        />
      </section>
    </section>
  );
}
