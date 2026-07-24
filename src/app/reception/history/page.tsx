import Header from "@/components/others/Header";
import ReceptionHistoryTable from "@/components/reception/ReceptionHistoryTable";

import { getReceptionsUnfinihsed } from "@/lib/actions/reception.actions";
import Link from "next/link";

export default async function History() {
  const unFinshedreception = await getReceptionsUnfinihsed();

  return (
    <>
      <Header text="Accueil" showPackIcon={true} />
      <section className="flex w-full flex-col py-3 px-2 items-center justify-center">
        <h2 className="capitalize text-xl lg:text-3xl font-semibold py-3 text-[#3354f4]">
          réceptions inachevées
        </h2>

        <div className="w-full xl:w-[90%]  flex justify-end py-6 pr-1 ">
          <Link
            href="/reception/create"
            className="bg-[#3354f4]  text-white rounded-md text-sm lg:text-lg py-2 px-2 font-medium hover:bg-[#3354f4]/90 cursor-pointer"
          >
            Nouvelle réception
          </Link>
        </div>

        <ReceptionHistoryTable receptions={unFinshedreception?.data} />
      </section>
    </>
  );
}
