import { addPriceColumns } from "@/components/reception/addPriceColums";
import { ReceptionPricesTable } from "@/components/reception/ReceptionPricesTable";
import { getreceptionsValidated } from "@/lib/actions/reception.actions";

export default async function AddPrice() {
  const allReceptions = await getreceptionsValidated({});
  return (
    <div className=" mx-auto py-10 px-3">
      <ReceptionPricesTable
        columns={addPriceColumns}
        data={allReceptions}
      />
    </div>
  );
}
