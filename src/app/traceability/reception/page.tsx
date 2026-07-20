import Header from "@/components/others/Header";
import TraceabilityReceptionHistoryTable from "@/components/reception/TraceabilityReceptionHistoryTable";
import { getreceptionsUnvalidatedAndFinishAddTrace } from "@/lib/actions/reception.actions";
import Link from "next/link";

export default async function page() {
  const unvalidatedReception = await getreceptionsUnvalidatedAndFinishAddTrace(
    {}
  );

  return (
    <>
      <Header text="Accueil" showPackIcon={true} link="/" />
      <section className="flex w-full flex-col py-3 px-2 items-center justify-center">
        <h2 className="capitalize text-xl lg:text-2xl font-semibold py-3 lg:py-4  text-[#3354f4]">
          Tracabilité inachevées
        </h2>

        <div className="w-full  lg:w-[90%] 2xl:w-[70%] flex flex-col items-end py-3 pr-1 ">
          <Link
            href="/reception/create?isTraceability=true"
            className="bg-[#3354f4] w-fit  text-white rounded-md text-sm lg:text-base py-2 px-2 font-medium hover:bg-[#3354f4]/90 cursor-pointer"
          >
            Nouvelle Tracabilité
          </Link>
        </div>

        <TraceabilityReceptionHistoryTable receptions={unvalidatedReception} />
      </section>
    </>
  );
}
