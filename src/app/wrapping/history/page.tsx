import Header from "@/components/others/Header";

import WrappingHistoryTable from "@/components/wrapping/WrappingHistoryTable";

import { getWrappingsUnfinihsed } from "@/lib/actions/wrapping.actions";
import Link from "next/link";

export default async function History() {
  const unFinshedWrapping = await getWrappingsUnfinihsed();

  return (
    <>
      <Header text="Accueil" showPackIcon={true} />
      <section className="flex w-full flex-col py-3 px-2 items-center justify-center">
        <h2 className="capitalize text-xl lg:text-3xl font-semibold py-3 lg:py-6  text-[#3354f4]">
          emballage inachevées
        </h2>

        <div className="w-full lg:w-[90%] 2xl:w-[70%] flex justify-end py-6 pr-1 ">
          <Link
            href="/wrapping/create"
            className="bg-[#3354f4]  text-white rounded-md text-sm lg:text-lg py-2 px-2 font-medium hover:bg-[#3354f4]/90 cursor-pointer"
          >
            Nouvelle Emballage
          </Link>
        </div>

        <WrappingHistoryTable wrappings={unFinshedWrapping?.data} />
      </section>
    </>
  );
}
