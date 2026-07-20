import FinishAddingTraceBtn from "@/components/invoice/FinishAddingTraceBtn";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import LastInvoice from "@/components/invoice/LastInvoice";
import Header from "@/components/others/Header";
import { getAllCompanies } from "@/lib/actions/company.actions";
import { getLastInvoice } from "@/lib/actions/invoice.actions";
import { getReceptionById } from "@/lib/actions/reception.actions";
import { User } from "lucide-react";
type CratetraceabilityProps = {
  searchParams: Promise<{ receptionId: number }>;
};
export default async function Cratetraceability({
  searchParams,
}: CratetraceabilityProps) {
  const { receptionId } = await searchParams;
  const reception = await getReceptionById(receptionId);
  const supplierName = `${reception?.supplier?.person?.firstname} ${reception?.supplier?.person?.lastname};`;
  const allcompanies = await getAllCompanies();
  const lastInvoice = await getLastInvoice(receptionId);

  return (
    <section className="flex flex-col items-center  w-full min-h-screen">
      <Header text="" link="/traceability/reception" showPackIcon={true}>
        <FinishAddingTraceBtn receptionId={receptionId} />
      </Header>
      <LastInvoice data={lastInvoice?.data} />
      <div className="text-center text-2xl text-[#3354f4]  font-semibold pt-8">
        Créer une traçabilité
      </div>

      <div className="flex justify-center  items-center  gap-2 py-4 mt-10 text-xl font-medium text-gray-800 ">
        <User width={33} height={33} className="text-[#3354f4]" />
        <span>{supplierName}</span>
      </div>

      <InvoiceForm
        type="Create"
        companies={allcompanies?.data}
        reception_id={receptionId}
      />
    </section>
  );
}
