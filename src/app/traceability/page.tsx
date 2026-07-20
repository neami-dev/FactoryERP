import ReceptionInfostable from "@/components/invoice/ReceptionInfostable";
import TraceablitiesTable from "@/components/invoice/TraceablitiesTable";
import Header from "@/components/others/Header";
import { getReceptionById } from "@/lib/actions/reception.actions";
import { notFound } from "next/navigation";

type ReceptionWeightFishProps = {
  searchParams: Promise<{ receptionId: number }>;
};
export default async function ShowTrac({
  searchParams,
}: ReceptionWeightFishProps) {
  const { receptionId } = await searchParams;

  if (!receptionId) notFound();
  const reception = await getReceptionById(receptionId);

  return (
    <section className="flex flex-col w-full min-h-screen">
      <Header text="" link="" showPackIcon={true} />
      <section className=" w-full min-h-screen flex py-6 flex-col items-center ">
        <div className="px-4 mx-auto w-full">
          <h2 className="text-base lg:text-2xl font-bold text-[#3354f4] py-4 text-center">
            Informations de traçabilité
          </h2>
        </div>

        <div className="relative w-full xl:w-fit overflow-x-auto mx-auto pt-3">
          <ReceptionInfostable reception={reception} />
        </div>
        <TraceablitiesTable receptionId={receptionId} />
      </section>
    </section>
  );
}
