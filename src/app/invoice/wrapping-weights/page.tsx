import Header from "@/components/others/Header";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

import PrintWrappingInvoiveBtn from "@/components/invoice/wrapping/PrintWrappingInvoiveBtn";
import { getWrappingById } from "@/lib/actions/wrapping.actions";
import WrappingInfostable from "@/components/invoice/wrapping/ReceptionInfostable";
import WrappingInvoiceTable from "@/components/invoice/wrapping/WrappingInvoiceTable";
import WrappingTotalWeightTable from "@/components/invoice/wrapping/WrappingTotalWeightTable";
import HasPermissionsServer from "@/components/auth/HasPermissionsServer";

type InvoiceWeightsProps = {
  searchParams: Promise<{ wrappingId: number,download:boolean }>;
};
export default async function InvoiceRecptionWeights({
  searchParams,
}: InvoiceWeightsProps) {
  const { wrappingId,download } = await searchParams;
  if (!wrappingId) notFound();

  const wrapping = await getWrappingById(wrappingId);

  return (
    <section className="bg-white w-full min-h-screen flex flex-col  gap-y-6 ">
      {!download && <Header text="" showPackIcon={true} link="/dashboard/wrapping">
        <HasPermissionsServer permission="download_invoice:wrapping">
          <PrintWrappingInvoiveBtn
            weight={wrapping?.total_weight ?? 0}
            wrappingId={wrappingId}
          />
        </HasPermissionsServer>
      </Header>}

      <div className={`max-w-6xl mx-auto space-y-6  min-h-screen  ${
          download ? "px-0 py-3" : "p-7 border bg-white shadow-lg  rounded-2xl"
        }`}>
          
        <div  >
          <h1 className="text-xl md:text-3xl  font-bold text-gray-900">
            Facture d’emballage
          </h1> 
          <p className="text-gray-600">Détails de l’emballage du poisson</p>
        </div>
      
        <div className="relative w-full xl:w-fit overflow-x-auto mx-auto ">
        {!download && <HasPermissionsServer permission="update:wrapping">
           <Link
              className="cursor-pointer my-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium p-2  border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"
              href={`/wrapping/${wrappingId}/update`}
            >
              <Image src={"/icons/edit.svg"} width={18} height={18} alt="" />{" "}
              Modifier l&apos;emballage
            </Link>
        </HasPermissionsServer>}

        <WrappingInfostable wrapping={wrapping} />
      </div>

      <div className="relative overflow-x-auto ">
        <Suspense
          fallback={
            <div className="w-full h-[500px] flex justify-center items-center">
              <Image
                src="/icons/infinite-spinner-loading.svg"
                alt="loading.."
                width={100}
                height={100}
              />
            </div>
          }
        >
          <WrappingInvoiceTable showUpdateBtn={!download} wrappingId={wrappingId} />
        </Suspense>
      </div>
       <div className="print-page-break mx-5" />
      <section className=" flex  max-w-5xl flex-wrap justify-center mx-auto gap-12 my-8">
        <Suspense
          fallback={
            <div className="w-full h-[500px] flex justify-center items-center">
              <Image
                src="/icons/infinite-spinner-loading.svg"
                alt="loading.."
                width={100}
                height={100}
              />
            </div>
          }
        >
          <WrappingTotalWeightTable wrappingId={wrappingId} />
        </Suspense>
      </section>
      </div>
    </section>
  );
}
