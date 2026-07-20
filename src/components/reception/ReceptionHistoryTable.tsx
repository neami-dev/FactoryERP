"use client";
import { IReception } from "@/interfaces";
import { formatDate, formatFloat } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getReceptionsUnfinihsed } from "@/lib/actions/reception.actions";
import { useQuery } from "@tanstack/react-query";

export default function ReceptionHistoryTable({
  receptions,
}: {
  receptions?: IReception[];
}) {
  const {
    data: receptionsResponse,
    isPending,
    isSuccess,
  } = useQuery({
    queryKey: ["UnfinishedReceptions"],
    queryFn: async () => await getReceptionsUnfinihsed(),
    initialData: { data: receptions ?? [] },
    // refetchOnWindowFocus: false,
    refetchInterval: 1000 * 2,
  });

  const route = useRouter();
  const handleClick = ({ receptionId }: { receptionId: number }) => {
    route.push(`/reception-weight-fish/create?receptionId=${receptionId}`);
  };
  return (
    <>
      <div className="relative w-full xl:w-[90%]    overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-base text-center text-gray-700 uppercase bg-gray-200  ">
            <tr>
              <th scope="col" className="px-1 py-3">
                Numéro
              </th>
              <th scope="col" className="px-2 py-3">
                Date
              </th>
              <th scope="col" className="px-2  py-3">
                Espace
              </th>
              <th scope="col" className="px-2 py-3">
                Fornisseur
              </th>
              <th scope="col" className="px-2 py-3">
                Origin
              </th>
              <th scope="col" className="px-2 whitespace-nowrap py-3">
                Q , Poisson
              </th>
              <th scope="col" className="px-2 whitespace-nowrap py-3">
                Q , traçabilité
              </th>
              <th scope="col" className="px-2 py-3">
                Peseur
              </th>
              <th scope="col" className="px-2 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {isPending && <h2>Loading..</h2>}
            {isSuccess &&
              receptionsResponse?.data.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className="bg-white border-b text-base text-center capitalize font-medium dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-2 py-4">{item.id}</td>
                    <td className="whitespace-nowrap py-4">
                      {formatDate(String(item.created_at))}
                    </td>
                    <td className="px-4 py-4">{item.fish_category?.name}</td>
                    <td className="whitespace-nowrap py-4">{`${item.supplier?.person?.firstname} ${item.supplier?.person?.lastname}`}</td>
                    <td className="whitespace-nowrap py-4">{item.origin}</td>
                    <td className="whitespace-nowrap py-4">
                      {formatFloat(item?.total_weight_net ?? 0)} Kg
                    </td>
                    <td className="whitespace-nowrap py-4">
                      {formatFloat(item?.total_weight_trace ?? 0)} Kg
                    </td>
                    <td className="whitespace-nowrap py-4 ">{`${item.weigher?.person?.firstname} ${item.weigher?.person?.lastname}`}</td>
                    <td className="whitespace-nowrap py-4">
                      <Button
                        onClick={() =>
                          handleClick({
                            receptionId: item.id,
                          })
                        }
                        className="font-medium bg-[#3354f4] hover:bg-[#3354f4]/90 cursor-pointer text-white   text-center"
                      >
                        Continuer
                      </Button>
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
