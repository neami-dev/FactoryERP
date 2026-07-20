"use client";
import { IReception } from "@/interfaces";
import { formatDate, formatFloat } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { useRef, useState } from "react";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { X } from "lucide-react";
import { updateReception } from "@/lib/actions/reception.actions";

export default function SelectWrappedReceptionTable({
  receptions,
}: {
  receptions: IReception[] | undefined;
}) {
  const [showPopup, setShowPopup] = useState<{
    show: boolean;
    id?: number;
    totalWeight?: number;
  }>({
    show: false,
  });
  const [showWError, setShowWError] = useState<boolean>(false);

  const weightRef = useRef<HTMLInputElement>(null);

  const hanldeAddWeight = async () => {
    let weight = null;

    if (weightRef.current) {
      weight = Number(weightRef.current.value);
    }
    if (weight == null) {
      setShowWError(true);
    } else {
      if (showPopup?.id) {
        try {
          if (showPopup?.totalWeight) {
            await updateReception({
              reception: {
                id: showPopup.id,
                weight_taken_in_wrapping: Number(weight),
                is_wrapped: false,
              },
              path: ["/wrapping-weight-fish/create"],
            });
            setShowWError(false);
          }

          setShowPopup({ show: false });
        } catch (error) {
          console.log(error);
        }
      }
    }
  };
  const handleWrapped = async (id: number) => {
    try {
      await updateReception({
        reception: {
          id: id,
          is_wrapped: true,
          weight_taken_in_wrapping: Number(0),
        },
        path: ["/wrapping-weight-fish/create"],
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center  w-[360px]  sm:w-[500px] md:w-[760px] lg:w-full mx-auto overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left  text-gray-500">
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
                le poids utilisé
              </th>
              <th scope="col" className="px-2 py-3">
                Sélectionner
              </th>
            </tr>
          </thead>
          <tbody>
            {receptions &&
              receptions?.length > 0 &&
              receptions?.map((item, index) => {
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
                      {!item.is_wrapped
                        ? item?.weight_taken_in_wrapping
                          ? formatFloat(
                              (item?.total_weight_net ?? 0) -
                                item?.weight_taken_in_wrapping
                            )
                          : formatFloat(item?.total_weight_net ?? 0)
                        : "0 "}
                      Kg
                    </td>
                    <td className="px-6 py-4">
                      {item.is_wrapped ? (
                        <div className="bg-green-200 text-green-700 rounded-xl p-1 text-sm">
                          Complet
                        </div>
                      ) : item?.weight_taken_in_wrapping ? (
                        <>
                          {formatFloat(item?.weight_taken_in_wrapping ?? 0)} kg
                        </>
                      ) : (
                        <div className="bg-blue-200 text-blue-700 rounded-xl p-1 text-sm">
                          Inconnu
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5  flex m-auto bg-gray-100  ">
                      <div className="flex items-center me-4">
                        <input
                          onClick={() => {
                            handleWrapped(item.id);
                          }}
                          id={`radio-complet-${item.id}`}
                          name={`status-${item.id}`}
                          type="radio"
                          defaultChecked={item.is_wrapped}
                          className="w-4 h-4 !accent-green-400 cursor-pointer bg-gray-100 border-gray-300 rounded-sm !focus:ring-green-500  "
                        />
                        <label
                          htmlFor={`radio-complet-${item.id}`}
                          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Complet
                        </label>
                      </div>

                      <div className="flex items-center me-4">
                        <input
                          onClick={() => {
                            setShowPopup({
                              show: true,
                              id: item.id,
                              totalWeight: item.total_weight_net,
                            });
                          }}
                          id={`radio-incomplet-${item.id}`}
                          name={`status-${item.id}`}
                          type="radio"
                          defaultChecked={!!item.weight_taken_in_wrapping}
                          className="w-4 h-4 !accent-blue-400 cursor-pointer bg-gray-100 border-none rounded-sm !outline-0 !ring-blue-500  "
                        />
                        <label
                          htmlFor={`radio-incomplet-${item.id}`}
                          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Puelques Poids
                        </label>
                      </div>
                    </td>
                    {/* <td className="px-6 py-4">
                      <input className="w-[150px] h-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="number"
                        placeholder="Poids"
                        aria-label="Poids"
                      />
                      
                    </td> */}
                  </tr>
                );
              })}
          </tbody>
        </table>{" "}
        {showPopup.show && (
          <section className="bg-gray-100 w-[300px]  shadow-md  absolute top-[150px]  flex flex-col items-center gap-4  py-7 px-2  rounded-md ">
            <span
              onClick={() => setShowPopup({ show: false })}
              className="font-extrabold ml-auto cursor-pointer mr-3 bg-red-600 hover:bg-red-400 w-fit p-0.5 text-white rounded"
            >
              <X />
            </span>
            <div className="flex flex-col gap-4">
              <Label>Entrer le Poids</Label>
              <div>
                <Input ref={weightRef} type="number" className="bg-white" />
                {showWError && (
                  <span className="text-sm text-red-600">
                    le Poids est Requis
                  </span>
                )}
              </div>
            </div>
            <Button
              onClick={hanldeAddWeight}
              className="bg-[#3354f4] hover:bg-[#3354f4]/90 cursor-pointer w-fit"
            >
              Enregistrer
            </Button>
          </section>
        )}
      </div>
    </div>
  );
}
