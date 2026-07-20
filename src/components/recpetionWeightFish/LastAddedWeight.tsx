import { IReceptionWeightFish } from "@/interfaces";

type lastAddedWeightParams = {
  data?: IReceptionWeightFish;
};
export default function LastAddedWeight({ data }: lastAddedWeightParams) {
  return (
    <>
      {data && (
        <div className="bg-blue-100 text-xl font-semibold text-gray-700 py-4 px-10  w-full flex flex-wrap justify-center items-center gap-4 md:gap-10">
          <h2 className="text-[#3354f4]">Dernière Insertion</h2>
          <p>
            Taille :{" "}
            <span className="uppercase text-[#3354f4]">
              {data.weight_type?.name}
            </span>
          </p>
          <p>
            {" "}
            Poid : <span className="text-[#3354f4]">{data.weight} Kg</span>
          </p>{" "}
          <p>
            Caisse : <span className="text-[#3354f4]">{data.crate}</span>
          </p>{" "}
        </div>
      )}
    </>
  );
}
