import WrappingInfostable from "@/components/invoice/wrapping/ReceptionInfostable";
import Header from "@/components/others/Header";
import WieghtsWrappingTypeTable from "@/components/wrapping/WieghtsWrappingTypeTable";
import { getWrappingById } from "@/lib/actions/wrapping.actions";
import { getWeightsByTypesAndWrapping } from "@/lib/actions/wrappingWeightFish.actions";
import { notFound } from "next/navigation";

type WrappingWeightFishProps = {
  searchParams: Promise<{ wrappingId: number; typeName: string }>;
};
export default async function wrappingWeightFish({
  searchParams,
}: WrappingWeightFishProps) {
  const { wrappingId, typeName } = await searchParams;
  if (!wrappingId && !typeName) notFound();
  const wrapping = await getWrappingById(wrappingId);
  const weightTypesdata = await getWeightsByTypesAndWrapping({
    wrappingId,
    type: typeName,
  });

  return (
    <section className="flex flex-col w-full min-h-screen">
      <Header
        text="Tous les poids d' emballage"
        link={`/invoice/wrapping-weights?wrappingId=${wrappingId}`}
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
          <WrappingInfostable wrapping={wrapping} />
        </div>
        <WieghtsWrappingTypeTable
          wrappingId={wrappingId}
          weightType={typeName}
          weightTypesdata={weightTypesdata}
        />
      </section>
    </section>
  );
}
