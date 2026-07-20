"use client";

import { useQuery } from "@tanstack/react-query";
import { IWrappingWeightFish } from "@/interfaces";
import Link from "next/link";
import { formatFloat } from "@/lib/utils";
import { getWeightsByTypesAndWrapping } from "@/lib/actions/wrappingWeightFish.actions";

export default function WieghtsWrappingTypeTable({
  wrappingId,
  weightType,
  weightTypesdata,
}: {
  wrappingId: number;
  weightType: string;
  weightTypesdata?: IWrappingWeightFish[];
}) {
  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["WeightWrappingTypes"],
    queryFn: async () =>
      await getWeightsByTypesAndWrapping({ wrappingId, type: weightType }),
    initialData: weightTypesdata,
    refetchInterval: 1000 * 2,
  });

  return (
    <>
      <div className="relative w-[310px]  sm:w-[530px] overflow-x-auto shadow-md mx-auto mt-10  rounded-lg">
        <table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className=" text-xs md:text-base text-center text-gray-700 uppercase bg-gray-200  ">
            <tr>
              <th scope="col" className="px-2 py-3">
                Number
              </th>

              <th scope="col" className="px-2 py-3">
                Caisse
              </th>
              <th scope="col" className="px-4 py-3">
                Poids
              </th>

              <th scope="col" className="px-2 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {isPending && (
              <tr className="bg-white border-b text-base text-center capitalize font-medium dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                Loading
              </tr>
            )}
            {isSuccess &&
              data?.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className="bg-white border-b text-base text-center capitalize font-medium dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-2 py-4">{item.id}</td>
                    <td className="px-3 py-4">{item.box}</td>
                    <td className="px-3 py-4">{formatFloat(item.weight)} kg</td>

                    <td className="px-3 py-4">
                      <Link
                        href={`/wrapping-weight-fish/${item.id}/update`}
                        className="font-medium bg-[#3354f4]/90  px-3 md:px-4 py-2 rounded-md hover:bg-[#3354f4] cursor-pointer text-white   text-center"
                      >
                        Modifier
                      </Link>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
}
