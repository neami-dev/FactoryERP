import { IWrappingWeightFish } from "@/interfaces";

type lastAddedWeightParams = {
  data?: IWrappingWeightFish;
};
export default function LastAddedWeight({ data }: lastAddedWeightParams) {
  return (
    <>
      {data && (
        <div className="bg-blue-100  xl:text-lg font-semibold text-gray-700 py-4 md:px-10  w-full flex flex-wrap justify-center items-center gap-1 md:gap-x-5 lg:gap-x-10">
          <h2 className="text-[#3354f4] block">Dernière Insertion</h2>
          <p>
            Taille :{" "}
            <span className="uppercase text-[#3354f4]">
              {data.wrapping_weight_type?.name}
            </span>
          </p>
          <p>
            {" "}
            Poid : <span className="text-[#3354f4]">{data.weight} Kg</span>
          </p>{" "}
          <p>
            Caisse : <span className="text-[#3354f4]">{data.box}</span>
          </p>{" "}
          <p>
            Type de Boîte :{" "}
            <span className="text-[#3354f4] lowercase">{data.box_type}</span>
          </p>{" "}
          <p>
            Type D&apos;emballage :{" "}
            <span className="text-[#3354f4]">{data.wrapping_type}</span>
          </p>{" "}
        </div>
      )}
    </>
  );
}
