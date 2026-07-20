import { wrappingColumns } from "@/components/wrapping/wrappingColumns";
import { WrappingTable } from "@/components/wrapping/WrappingTable";
import { getAllWrappings } from "@/lib/actions/wrapping.actions";

export default async function page() {
  const allwrappings = await getAllWrappings({});
  return (
    <div>
      <WrappingTable columns={wrappingColumns} data={allwrappings} />
    </div>
  );
}
