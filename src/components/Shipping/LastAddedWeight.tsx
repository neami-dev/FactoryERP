import { IShippingWeightFish } from "@/interfaces";

type lastAddedWeightParams = {
  data?: IShippingWeightFish;
};
export default function LastAddedWeight({ data }: lastAddedWeightParams) {
  return (
    <>
      {data && (
        <div className="bg-blue-100  xl:text-lg font-semibold text-gray-700 py-4 md:px-10  w-full flex flex-wrap justify-center items-center gap-3 md:gap-10">
          <h2 className="text-[#3354f4] block">Dernière Insertion</h2>
          <p>
            T :{" "}
            <span className="uppercase text-[#3354f4]">
              {data.wrapping_weight_type?.name}
            </span>
          </p>
          <p>
            {" "}
            KG : <span className="text-[#3354f4]">{data.weight} Kg</span>
          </p>{" "}
          <p>
            Caisse : <span className="text-[#3354f4]">{data.box}</span>
          </p>{" "}
          <p>
            T :{" "}
            <span className="text-[#3354f4] lowercase">{data.box_type}</span>
          </p>{" "}
          <p>
            T/E : <span className="text-[#3354f4]">{data.wrapping_type}</span>
          </p>{" "}
          <p>
            Q : <span className="text-[#3354f4]">{data?.quality?.code}</span>
          </p>{" "}
          <p>
            N/P :{" "}
            <span className="text-[#3354f4]">
              {data?.pallet?.pallet_number}
            </span>
          </p>{" "}
        </div>
      )}
    </>
  );
}
