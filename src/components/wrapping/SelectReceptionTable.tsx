"use client";
import { IReception } from "@/interfaces";
import { formatDate, formatFloat } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { createReceptionWrapping } from "@/lib/actions/receptionWrapping.actions";

import { useRouter } from "next/navigation";
import PopUpErrorMessage from "../others/PopUpErrorMessage";
import { getReceptionsNotWrapped } from "@/lib/actions/reception.actions";
import { toast } from "sonner";
import Image from "next/image";

export default function SelectReceptionTable({
  receptions,
  fishCategoryId,
  wrappingId,
}: {
  receptions?: {
    data: IReception[];
    total: number;
    page: number;
    totalPages: number;
  };
  fishCategoryId: number;
  wrappingId: number;
}) {
  const [page, setPage] = useState(1);
  const [selectIds, setSelectIds] = useState<number[] | []>([]);
  const [showError, setShowError] = useState<boolean>(false);
  const router = useRouter();
  const limit = 8;

  const {
    data: receptionsResponse,
    isPending,
    isSuccess,
  } = useQuery({
    queryKey: ["wrapped", page, limit, fishCategoryId],
    queryFn: async () =>
      await getReceptionsNotWrapped({ limit, page, fishCategoryId }),
    initialData: receptions,

    refetchInterval: 1000 * 2,
  });

  const handleSelect = async () => {
    if (selectIds.length === 0) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);

      return;
    }
    selectIds.forEach(async (reception_id) => {
      await createReceptionWrapping({
        path: "/wrapping/create/select-receptions",
        receptionWrapping: { reception_id, wrapping_id: wrappingId },
      });
    });
    router.replace(`/wrapping-weight-fish/create?wrappingId=${wrappingId}`);
    toast.success("créé avec succès");
    setSelectIds([]);
  };
  return (
    <>
      <div className=" w-full xl:w-[90%] flex justify-end my-3">
        <Button
          onClick={handleSelect}
          className="bg-[#3354f4] text-base hover:bg-[#3354f4]/90 cursor-pointer  "
        >
          Emballer
        </Button>
        {showError ? (
          <PopUpErrorMessage
            title="Aucune réception sélectionnée"
            message="Veuillez sélectionner au moins une réception."
          />
        ) : null}
      </div>
      <div className="relative w-full xl:w-[90%]   overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className=" text-center text-gray-700 uppercase bg-gray-200  ">
            <tr>
              <th scope="col" className="px-2 py-3">
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
                Q , tracabilité
              </th>
              <th scope="col" className="px-2 py-3">
                Peseur
              </th>
              <th scope="col" className="px-2 py-3">
                Sélectionner
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
                    className="bg-white border-b text-base text-center whitespace-nowrap capitalize font-medium dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-2 py-4">{item.id}</td>
                    <td className="whitespace-nowrap py-4">
                      {formatDate(String(item.created_at))}
                    </td>
                    <td className="px-4 py-4">{item.fish_category?.name}</td>
                    <td className="whitespace-nowrap py-4">
                      {item.supplier?.person?.firstname}{" "}
                      {item.supplier?.person?.lastname}
                    </td>
                    <td className="whitespace-nowrap py-4">{item.origin}</td>
                    <td className="whitespace-nowrap py-4">
                      {formatFloat(item?.total_weight_net ?? 0)} Kg
                    </td>
                    <td className="whitespace-nowrap py-4">
                      {formatFloat(item?.total_weight_trace ?? 0)} Kg
                    </td>
                    <td className="whitespace-nowrap py-4">
                      {item.weigher?.person?.firstname}{" "}
                      {item.weigher?.person?.lastname}
                    </td>
                    <td className="whitespace-nowrap py-3">
                      <label htmlFor="checked-checkbox" className="sr-only">
                        {" "}
                      </label>
                      <input
                        id="checked-checkbox"
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectIds((prev) => [...prev, item.id]);
                          } else {
                            setSelectIds((prev) =>
                              prev.filter((id) => id !== item.id)
                            );
                          }
                        }}
                        title="Select all receptions"
                        className="w-4 h-4 text-blue-600  cursor-pointer bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {receptionsResponse?.data.length == 0 && (
          <div className="mx-auto flex justify-center items-center gap-5 text-xl py-8 font-semibold">
            <Image
              src="/icons/empty.svg"
              alt="edit"
              width={40}
              height={40}
              className="cursor-pointer "
            />
            Réceptions non trouvées ou non validées.
          </div>
        )}
      </div>

      <div className="flex flex-col items-end p-4 w-full xl:w-[90%] ">
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
  );
}
