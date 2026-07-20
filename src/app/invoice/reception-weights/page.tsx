import Header from "@/components/others/Header";

import ReceptionComapnyInvoicesTable from "@/components/invoice/ReceptionComapnyInvoicesTable";
import ReceptionInfostable from "@/components/invoice/ReceptionInfostable";

import ReceptionTotalWeightTable from "@/components/invoice/ReceptionTotalWeightTable";

import { getReceptionById } from "@/lib/actions/reception.actions";

import { notFound } from "next/navigation";
import PrintRecptionInvoiveBtn from "@/components/invoice/PrintRecptionInvoiveBtn";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import HasPermissionsServer from "@/components/auth/HasPermissionsServer";
import ReceptionWeightDetails from "@/components/invoice/ReceptionWeightDetails";

type InvoiceWeightsProps = {
  searchParams: Promise<{ receptionId: number; download: boolean }>;
};
export default async function InvoiceRecptionWeights({
  searchParams,
}: InvoiceWeightsProps) {
  const { receptionId, download } = await searchParams;
  if (!receptionId) notFound();

  const reception = await getReceptionById(receptionId);

  return (
    <section className=" bg-white shadow w-full min-h-screen flex flex-col  gap-y-6 ">
      {!download && (
        <Header text="" showPackIcon={true} link="/dashboard/reception">
          <HasPermissionsServer permission="download_invoice:reception">
            <PrintRecptionInvoiveBtn receptionId={receptionId} />
          </HasPermissionsServer>
        </Header>
      )}
      <div
        className={`max-w-6xl mx-auto space-y-6  min-h-screen  ${
          download ? "px-0 py-3" : "p-7 border bg-white shadow-lg  rounded-2xl"
        }`}
      >
        <div>
          <h1 className="text-xl md:text-3xl  font-bold text-gray-900">
            Facture de Réception
          </h1>
          <p className="text-gray-600">Détails de la réception de poisson</p>
        </div>

        <div className=" w-fit mx-auto 2xl:px-4 ">
          {!download && (
            <HasPermissionsServer permission="update:reception">
              {" "}
              <Link
                className="cursor-pointer my-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium p-2  border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"
                href={`/reception/${receptionId}/update`}
              >
                <Image src={"/icons/edit.svg"} width={18} height={18} alt="" />{" "}
                Modifier la réception
              </Link>
            </HasPermissionsServer>
          )}
          <ReceptionInfostable reception={reception} />
        </div>

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
          <ReceptionWeightDetails
            showUpdateBtn={!download}
            receptionId={receptionId}
          />
        </Suspense>
        <div className="print-page-break mx-5" />
        {/* Final Totals Summary */}
        <ReceptionTotalWeightTable receptionId={receptionId} />

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
          <HasPermissionsServer permission="show:traceability_invoice">
            <ReceptionComapnyInvoicesTable
              showUpdateBtn={!download}
              receptionId={receptionId}
            />
          </HasPermissionsServer>
        </Suspense>
      </div>
    </section>
  );
}
