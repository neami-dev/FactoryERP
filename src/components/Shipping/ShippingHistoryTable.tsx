"use client";
import { IShipping } from "@/interfaces";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { useQuery } from "@tanstack/react-query";

import { getShippingsUnfinihsed } from "@/lib/actions/shipping.actions";

export default function ShippingHistoryTable({
  shippings,
}: {
  shippings?: IShipping[];
}) {
  const {
    data: shippingsResponse,
    isPending,
    isSuccess,
  } = useQuery({
    queryKey: ["UnfinishedShippings"],
    queryFn: async () => await getShippingsUnfinihsed(),
    initialData: { data: shippings ?? [] },
    // refetchOnWindowFocus: false,
    refetchInterval: 1000 *2,
  });

  const route = useRouter();
  const handleClick = ({
    shippingFishCategoryId,
    categoryFishLen,
    shippingId,
  }: {
    shippingFishCategoryId?: number;
    categoryFishLen?: number;
    shippingId: number;
  }) => {
    if (categoryFishLen && categoryFishLen > 0) {
      route.push(
        `/shipping-weight-fish/create?shippingFishCategoryId=${shippingFishCategoryId}`
      );
    } else {
      route.push(`/shipping/select-category?shippingId=${shippingId}`);
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
              shippingsResponse?.data.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className="bg-white border-b text-base text-center capitalize font-medium dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-2 py-4">{item.id}</td>
                    <td className="px-2 py-4  whitespace-nowrap">
                      {formatDate(String(item.created_at))}
                    </td>
                    <td className=" w-fit mx-auto px-1 py-4 flex flex-wrap items-center justify-center gap-3">
                      {item.shipping_Fish_category?.map((fc, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset"
                        >
                          {fc.fish_category?.name}
                        </span>
                      ))}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">{`${item.client?.person?.firstname} ${item.client?.person?.lastname}`}</td>
                    <td className="px-2 py-4 whitespace-nowrap">{`${item.weigher?.person?.firstname} ${item.weigher?.person?.lastname}`}</td>

                    <td className="px-2 py-4">
                      <Button
                        onClick={() => {
                          if (item.shipping_Fish_category?.length) {
                            handleClick({
                              shippingFishCategoryId:
                                item.shipping_Fish_category[0].id,
                              categoryFishLen:
                                item.shipping_Fish_category.length,
                              shippingId: item.id,
                            });
                          } else {
                            handleClick({
                              shippingId: item.id,
                            });
                          }
                        }}
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
