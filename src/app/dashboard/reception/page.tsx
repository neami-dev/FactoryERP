import { receptionColumns } from "@/components/reception/ReceptionColums";
import { ReceptionTable } from "@/components/reception/ReceptionTable";
import { getReceptions } from "@/lib/actions/reception.actions";
export default async function Recption() {
  const allReceptions = await getReceptions({});
  
  return (
    <div className="relative">
      <ReceptionTable columns={receptionColumns} data={allReceptions} />
    </div>
  );
}
