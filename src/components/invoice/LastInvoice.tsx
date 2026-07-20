import { IInvoice } from "@/interfaces";

type LastInvoiceParams = {
  data?: IInvoice;
};
export default function LastInvoice({ data }: LastInvoiceParams) {
 
    
  return (
    <>
      {data && (
        <div className="bg-blue-100 text-xl font-semibold text-gray-700 py-4 px-10  w-full flex flex-wrap justify-center items-center gap-4 md:gap-10">
          <h2 className="text-[#3354f4]">Dernière Insertion</h2>
          <p>
            Marayeur :{" "}
            <span className="uppercase text-[#3354f4]">
              {data.company.name}
            </span>
          </p>
          <p>
            {" "}
            N, Tracabilite :{" "}
            <span className="text-[#3354f4]">{data.trace_code}</span>
          </p>{" "}
          <p>
            Quantite :{" "}
            <span className="text-[#3354f4]">{data.total_weight}</span>
          </p>{" "}
        </div>
      )}
    </>
  );
}
