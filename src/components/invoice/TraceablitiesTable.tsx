 
 
import Link from "next/link";
import ReceptionComapnyInvoicesTable from "./ReceptionComapnyInvoicesTable";
import Image from "next/image";

export default function TraceablitiesTable({
  receptionId,
}: {
  receptionId: number;
}) {
  return (
    <>
      <div className="relative overflow-x-auto">
        {" "}
        <Link
          className="bg-[#3354f4]/90 hover:bg-[#3354f4] w-fit h-fit text-white py-1 md:py-2 px-1.5 md:px-4 m-4    flex gap-4 items-center text-lg font-medium rounded-md"
          href={`/traceability/create?receptionId=${receptionId}`}
        >
          <Image src={"/icons/add.svg"} width={23} height={23} alt="" />Ajouter 
        </Link>
        <ReceptionComapnyInvoicesTable
          showUpdateBtn={true}
          receptionId={receptionId}
        />
      </div>
    </>
  );
}
