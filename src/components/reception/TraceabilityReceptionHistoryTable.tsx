"use client";
import { IReception } from "@/interfaces";
import { formatDate, formatFloat } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { getreceptionsUnvalidatedAndFinishAddTrace } from "@/lib/actions/reception.actions";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import Link from "next/link";
import Image from "next/image";

export default function TraceabilityReceptionHistoryTable({
  receptions,
}: {
  receptions?: {
    data: IReception[];
    total: number;
    page: number;
    totalPages: number;
  };
}) {
  const [page, setPage] = useState(1);
  const limit = 8;

  const {
    data: receptionsResponse,
    isFetched,
    isSuccess,
  } = useQuery({
    queryKey: ["UnvalidatedReceptions", page, limit],
    queryFn: async () =>
      await getreceptionsUnvalidatedAndFinishAddTrace({ limit, page }),
    initialData: receptions,

    refetchInterval: 1000 * 6,
  });

  return (
    <>
      <div className="relative w-full lg:w-[90%] 2xl:w-[70%]  overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className=" text-center text-gray-700 uppercase bg-gray-200  ">
            <tr>
              <th scope="col" className="px-2 py-3">
                Number
              </th>
              <th scope="col" className="px-3 py-3">
                Date
              </th>
              <th scope="col" className="px-2  py-3">
                Espace
              </th>
              <th scope="col" className="px-3 py-3">
                Fornisseur
              </th>
              <th scope="col" className="px-3 py-3">
                Origin
              </th>
              <th scope="col" className="px-3 py-3">
                Q , Poisson
              </th>
              <th scope="col" className="px-3 py-3">
                Q , tracabilité
              </th>
              <th scope="col" className="px-3 py-3">
                Peseur
              </th>
              <th scope="col" className="px-2 py-3">
                Actes
              </th>
            </tr>
          </thead>
          <tbody>
            {isFetched && receptionsResponse?.data.length === 0 && (
              <tr>
                <td colSpan={9} className="w-full py-8">
                  <div className="mx-auto flex justify-center items-center gap-5 text-xl font-semibold">
                    <Image
                      src="/icons/empty.svg"
                      alt="edit"
                      width={40}
                      height={40}
                      className="cursor-pointer "
                    />
                    Aucune donnée.
                  </div>
                </td>
              </tr>
            )}
            {isSuccess &&
              receptionsResponse?.data.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className="bg-white border-b text-base text-center whitespace-nowrap capitalize font-medium dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-2 py-4">{item.id}</td>
                    <td className="px-6 py-4">
                      {formatDate(String(item.created_at))}
                    </td>
                    <td className="px-4 py-4">{item.fish_category?.name}</td>
                    <td className="px-6 py-4">
                      {item.supplier?.person?.firstname}{" "}
                      {item.supplier?.person?.lastname}
                    </td>
                    <td className="px-6 py-4">{item.origin}</td>
                    <td className="px-6 py-4">
                      {formatFloat(item?.total_weight_net ?? 0)} Kg
                    </td>
                    <td className="px-6 py-4">
                      {formatFloat(item?.total_weight_trace ?? 0)} Kg
                    </td>
                    <td className="px-6 py-4">
                      {item.weigher?.person?.firstname}{" "}
                      {item.weigher?.person?.lastname}
                    </td>
                    <td className="px- py-3 mx-auto flex w-[120px]">
                      <Link
                        href={`/traceability/create?receptionId=${item.id}`}
                        className=" cursor-pointer  border rounded-md w-fit mx-auto p-2  hover:bg-[#3354f4]/10 duration-200 text-base text-black"
                      >
                        <Image
                          src={`/icons/add-note.svg`}
                          width={25}
                          height={25}
                          alt=""
                        />
                      </Link>
                      <Link
                        href={`/traceability?receptionId=${item.id}`}
                        className=" cursor-pointer  border rounded-md  w-fit mx-auto p-2  hover:bg-[#3354f4]/10 duration-200 text-base text-black"
                      >
                        <Image
                          src={`/icons/eye-show.svg`}
                          width={25}
                          height={25}
                          alt=""
                        />
                      </Link>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <>
        <div className="flex flex-col items-end p-4 w-full lg:w-[90%] 2xl:w-[70%] ">
          {/* Help text */}
          <span className="text-sm text-gray-700 dark:text-gray-400">
            Page{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {receptionsResponse?.page}
            </span>{" "}
            sur{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {receptionsResponse?.totalPages}
            </span>{" "}
            —{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {receptionsResponse?.total}
            </span>{" "}
            entrées au total
          </span>

          <div className="inline-flex mt-2 xs:mt-0">
            {/* Buttons */}
            <Button
              className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-[#3354f4] hover:bg-[#3354f4]/90 cursor-pointer "
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              <svg
                className="w-3.5 h-3.5 me-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5H1m0 0 4 4M1 5l4-4"
                />
              </svg>
              Prev
            </Button>
            <Button
              className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-[#3354f4] hover:bg-[#3354f4]/90  ml-2 cursor-pointer   "
              onClick={() =>
                setPage((prev) =>
                  Math.min(prev + 1, receptionsResponse?.totalPages || 1)
                )
              }
              disabled={
                (page === receptionsResponse?.totalPages ||
                  receptionsResponse?.totalPages === 0) &&
                true
              }
            >
              Next
              <svg
                className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </Button>
          </div>
        </div>
      </>
    </>
  );
}
