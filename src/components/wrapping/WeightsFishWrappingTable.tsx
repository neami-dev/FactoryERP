"use client";
import { IWrappingWeightFish } from "@/interfaces";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import Image from "next/image";

import { useState } from "react";
import { deleteWrappingWeightFish } from "@/lib/actions/wrappingWeightFish.actions";
type weightTypeTableParams = {
  data?: IWrappingWeightFish[];
  fishName: string;
};

export default function WeightsFishWrappingTable({
  data,
  fishName,
}: weightTypeTableParams) {
  const [isLoading, setIsLoading] = useState(false);
  const deleteItem = async (id: number) => {
    setIsLoading(true);
    await deleteWrappingWeightFish({
      id,
      path: "wrapping-weight-fish/create",
    });
    setIsLoading(false);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            className=" py-5 text-base   w-fit text-black cursor-pointer"
          >
            <Image
              src="/icons/balance.svg"
              alt="weight"
              width={20}
              height={20}
              className="sm:mr-2"
            />
            <p className="hidden sm:block">Afficher le poids</p>
          </Button>
        </DialogTrigger>
        <DialogContent className=" w-full flex p-2 flex-col items-center  rounded-lg shadow-sm border border-blue-100 ">
          <DialogHeader>
            <DialogTitle className="text-center pt-5 text-[#3354f4] font-bold text-xl">
              liste de poids du <span className="capitalize">{fishName}</span>
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="w-full lg:w-4xl my-4 overflow-x-scroll sm:overflow-auto rounded-lg shadow-sm border border-blue-100 ">
            <table className="w-full  ">
              <thead className="bg-blue-50">
                <tr>
                  <th className="py-3 px-4 text-xs md:text-sm text-center text-[#3354f4]">
                    Nom du type de poids
                  </th>
                  <th className="py-3 px-4 text-xs md:text-sm  text-center text-[#3354f4]">
                    Poids (kg)
                  </th>
                  <th className="py-3 px-4 text-xs md:text-sm  text-center text-[#3354f4]">
                    Caisses
                  </th>
                  <th className="py-3 px-4 text-xs md:text-sm  text-center text-[#3354f4]">
                    Type de boîte
                  </th>
                  <th className="py-3 px-4 text-xs md:text-sm  text-center text-[#3354f4]">
                    Type d&apos;emballage
                  </th>
                  <th className="py-3 px-4 text-xs md:text-sm  text-center text-[#3354f4]">
                    Actes
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.length === 0 && (
                  <tr>
                    <td colSpan={4} className="w-full py-8">
                      <div className="mx-auto flex justify-center items-center gap-5 text-xl font-semibold">
                        {data?.length === 0 && (
                          <Image
                            src="/icons/empty.svg"
                            alt="edit"
                            width={40}
                            height={40}
                            className="cursor-pointer "
                          />
                        )}
                        Aucune donnée.
                      </div>
                    </td>
                  </tr>
                )}
                {data?.map((item) => {
                  return (
                    <tr key={item.id} className="border-t border-blue-100">
                      <td className="py-3 px-4 text-xs md:text-base font-medium text-center">
                        {item.wrapping_weight_type?.name}
                      </td>
                      <td className="py-3 px-4 text-xs md:text-base text-center font-medium ">
                        {item.weight}{" "}
                      </td>
                      <td className="py-3 px-4 text-xs md:text-base text-center font-medium ">
                        {item.box}
                      </td>
                      <td className="py-3 px-4 text-xs md:text-base text-center font-medium ">
                        {item.box_type}
                      </td>
                      <td className="py-3 px-4 text-xs md:text-base text-center font-medium ">
                        {item.wrapping_type}
                      </td>
                      <td className="py-3 px-4 flex gap-5 justify-center items-center">
                        {isLoading ? (
                          <Image
                            src="/icons/loading.svg"
                            alt="edit"
                            width={25}
                            height={20}
                            className=" mx-[30px]"
                          />
                        ) : (
                          <>
                            {/* <Image
                              src="/icons/update.svg"
                              alt="edit"
                              width={20}
                              height={20}
                              className="cursor-pointer"
                              onClick={() => {}}
                            />
                            | */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Image
                                  src="/icons/delete.svg"
                                  alt="edit"
                                  width={20}
                                  height={20}
                                  className="cursor-pointer"
                                />
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-xl">
                                    Êtes-vous absolument sûr ?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-lg font-semibold">
                                    Cette action ne peut pas être annulée.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="cursor-pointer">
                                    Annuler
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-700 cursor-pointer hover:bg-red-800"
                                    onClick={() => {
                                      deleteItem(item.id);
                                    }}
                                  >
                                    Continuer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
