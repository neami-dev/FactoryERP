import InvoiceForm from "@/components/invoice/InvoiceForm";
 
import Header from "@/components/others/Header";
import { getAllCompanies } from "@/lib/actions/company.actions";
import { getInvoicesById } from "@/lib/actions/invoice.actions";
 
type UpdatetraceabilityProps = {
  params: Promise<{ id: number }>;
};
export default async function Updatetraceability({
  params,
}: UpdatetraceabilityProps) {
  const { id } = await params;

  const allcompanies = await getAllCompanies();
  const invoice = await getInvoicesById(id);

  return (
    <section className="flex flex-col items-center  w-full min-h-screen">
      <Header text="" showPackIcon={true} />

      <div className="text-center text-2xl text-[#3354f4]  font-semibold py-14">
        Modifier Tracabilite
      </div>

      <InvoiceForm
        type="Update"
        invoice_id={invoice?.data.id}
        companies={allcompanies?.data}
        invoice={invoice?.data}
      />
    </section>
  );
}
