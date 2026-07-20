import { getReceptionById } from "@/lib/actions/reception.actions";
import ReceptionInfostable from "@/components/invoice/ReceptionInfostable";
import ReceptionComapnyInvoicesTable from "@/components/invoice/ReceptionComapnyInvoicesTable";
import ReceptionTotalWeightTable from "@/components/invoice/ReceptionTotalWeightTable";
import { notFound } from "next/navigation";
import ReceptionWeightDetails from "@/components/invoice/ReceptionWeightDetails";

export default async function PdfPage({
  params,
}: {
  params: Promise<{ receptionId: string }>;
}) {
  const { receptionId } = await params;

  const id = parseInt(receptionId);
  if (!id) notFound();

  const reception = await getReceptionById(id);

  return (
    <html>
      <body
        //  style={{
        //   padding:"10px"
        // }}
        className="!py-10"
      >
        <div className="w-full min-h-screen flex flex-col justify-center items-center">
          <ReceptionInfostable reception={reception} />
          <ReceptionWeightDetails showUpdateBtn={false} receptionId={id} />
        </div>
        <div className="print-page-break mx-5" />
        <section className="w-full min-h-screen flex flex-col justify-center items-center gap-8">
          <ReceptionInfostable reception={reception} />

          <ReceptionComapnyInvoicesTable
            showUpdateBtn={false}
            receptionId={id}
          />
        </section>

        <div className="print-page-break mx-5" />
        <section className="w-full min-h-screen flex flex-col justify-center items-center gap-8 px-10">
          <ReceptionInfostable reception={reception} />
          <ReceptionTotalWeightTable receptionId={id} />
        </section>
      </body>
    </html>
  );
}
