import ResualtOfReceptionPrice from "@/components/dashboard/ResualtOfReceptionPrice";
import TableToAddPrice from "@/components/dashboard/TableToAddPrice";
import ReceptionInfostable from "@/components/invoice/ReceptionInfostable";
import { getReceptionById } from "@/lib/actions/reception.actions";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
type ReceptionaddPriceProps = {
  params: Promise<{ id: number }>;
};
export default async function AddPrices({ params }: ReceptionaddPriceProps) {
  const { id } = await params;
  const reception = await getReceptionById(id);

  if (!reception) notFound();
  return (
    <section className="flex flex-col justify-center w-full relative items-center ">
      <div className="my-8 w-[70%]  ">
         <h1 className="text-xl md:text-3xl  font-bold text-gray-900">
          Facture de réception des prix
        </h1> 
        <p className="text-gray-600 ">Détails de la réception de poisson</p>
      </div>
      <div className="relative w-full xl:w-fit overflow-x-auto mx-auto ">
        {" "}
        <ReceptionInfostable reception={reception} />
      </div>
      
        <Suspense
          fallback={
            <div className="flex w-full h-[500px] justify-center items-center">
              <Image
                src="/icons/infinite-spinner-loading.svg"
                alt=""
                width={100}
                height={100}
              />
            </div>
          }
        >
          <div className="relative w-full max-w-4xl  overflow-x-auto mx-auto ">
            <TableToAddPrice showUpdateBtn={true} receptionId={reception.id} />
          </div>
          <div className="relative w-full max-w-4xl overflow-x-auto mx-auto ">
            <ResualtOfReceptionPrice
              showUpdateBtn={true}
              receptionId={reception.id}
            />
          </div>
        </Suspense>
       
    </section>
  );
}
