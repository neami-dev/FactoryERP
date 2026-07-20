import { notFound } from "next/navigation";
import { getWrappingById } from "@/lib/actions/wrapping.actions";
import WrappingInfostable from "@/components/invoice/wrapping/ReceptionInfostable";
import WrappingInvoiceTable from "@/components/invoice/wrapping/WrappingInvoiceTable";
import WrappingTotalWeightTable from "@/components/invoice/wrapping/WrappingTotalWeightTable";

export default async function PdfPage({
  params,
}: {
  params: Promise<{ wrappingId: string }>;
}) {
  const { wrappingId } = await params;

  const id = parseInt(wrappingId);
  if (!id) return notFound();

  const wrapping = await getWrappingById(id);

  return (
    <html>
      <body
        //  style={{
        //   padding:"10px"
        // }}
        className="!py-10"
      >
        <div className="w-full min-h-screen flex flex-col justify-center items-center">
          <WrappingInfostable wrapping={wrapping} />
          <WrappingInvoiceTable showUpdateBtn={false} wrappingId={id} />
        </div>
       

        <div className="print-page-break mx-5" />
        <section className="w-full min-h-screen flex flex-col justify-center items-center gap-8 px-10">
          <WrappingInfostable wrapping={wrapping} />
          <WrappingTotalWeightTable wrappingId={id} />
        </section>
      </body>
    </html>
  );
}
