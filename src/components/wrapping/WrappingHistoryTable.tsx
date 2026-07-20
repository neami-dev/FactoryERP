"use client";
import { IWrapping } from "@/interfaces";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { useQuery } from "@tanstack/react-query";
import { getWrappingsUnfinihsed } from "@/lib/actions/wrapping.actions";

export default function WrappingHistoryTable({
  wrappings,
}: {
  wrappings?: IWrapping[];
}) {
  const {
    data: wrappingsResponse,
    isPending,
    isSuccess,
  } = useQuery({
    queryKey: ["UnfinishedWrappings"],
    queryFn: async () => await getWrappingsUnfinihsed(),
    initialData: { data: wrappings ?? [] },
    // refetchOnWindowFocus: false,
    refetchInterval: 1000 * 2,
  });

  const route = useRouter();
  const handleClick = ({
    wrappingId,
    receptionLen,
  }: {
    wrappingId: number;
    receptionLen?: number;
  }) => {
    if (receptionLen && receptionLen > 0) {
      route.push(`/wrapping-weight-fish/create?wrappingId=${wrappingId}`);
    } else {
      route.push(`/wrapping/create/select-receptions?wrappingId=${wrappingId}`);
    }
  };
  return (
    <>
      <div className="relative w-full lg:w-[90%] 2xl:w-[70%]  overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-base text-center text-gray-700 uppercase bg-gray-200  ">
            <tr>
              <th scope="col" className="px-2 py-3">
                Number
              </th>
              <th scope="col" className="px-12 py-3">
                Date
              </th>
              <th scope="col" className="px-2  py-3">
                Espace
              </th>
              <th scope="col" className="px-10 py-3">
                Fornisseur
              </th>

              <th scope="col" className="px-10 py-3">
                Peseur
              </th>
              <th scope="col" className="px-10 py-3">
                Receptions
              </th>
              <th scope="col" className="px-2 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {isPending && <h2>Loading..</h2>}
            {isSuccess &&
              wrappingsResponse?.data.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className="bg-white border-b text-base text-center capitalize font-medium dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-2 py-4">{item.id}</td>
                    <td className="px-6 py-4">
                      {formatDate(String(item.created_at))}
                    </td>
                    <td className="px-4 py-4">{item.fish_category?.name}</td>
                    <td className="px-6 py-4">{`${item.client?.person?.firstname} ${item.client?.person?.lastname}`}</td>
                    <td className="px-6 py-4">{`${item.weigher?.person?.firstname} ${item.weigher?.person?.lastname}`}</td>
                    <td className="px-6 py-4">
                      {item.reception_wrapping?.length}
                    </td>

                    <td className="px-6 py-4">
                      <Button
                        onClick={() =>
                          handleClick({
                            wrappingId: item.id,
                            receptionLen: item.reception_wrapping?.length,
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
