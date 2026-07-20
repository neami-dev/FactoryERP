import { getReceptionById } from "@/lib/actions/reception.actions";
import ReceptionInfostable from "@/components/invoice/ReceptionInfostable";
import { notFound } from "next/navigation";
import TableToAddPrice from "@/components/dashboard/TableToAddPrice";
import ResualtOfReceptionPrice from "@/components/dashboard/ResualtOfReceptionPrice";

export default async function PdfPage({
  params,
}: {
  params: Promise<{ receptionId: string }>;
}) {
  const { receptionId } = await params;

  const id = parseInt(receptionId);
  if (!id) notFound();

  const reception = await getReceptionById(id);
  if (!reception) return;
  return (
    <html>
      <body className="!py-4 px-4">
        <div className="relative">
       <div className="my-6">
         <h1 className="text-xl md:text-3xl  font-bold text-gray-900">
          Facture de réception des prix
        </h1> 
        <p className="text-gray-600 ">Détails de la réception de poisson</p>
       </div>
          <ReceptionInfostable reception={reception} />
          <TableToAddPrice showUpdateBtn={false} receptionId={reception.id} />
          <div className="print-page-break mx-5" />
          <ReceptionInfostable reception={reception} />
          <ResualtOfReceptionPrice
            showUpdateBtn={false}
            receptionId={reception.id}
          />
        </div>
      </body>
    </html>
  );
}
