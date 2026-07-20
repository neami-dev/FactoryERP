"use client";
import { ICategory } from "@/interfaces";
import {
  deleteCategory,
  isCategoryUsed,
} from "@/lib/actions/fishCategory.actions";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
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
} from "../ui/alert-dialog";
import { useRouter } from "next/navigation";
import { bufferToBase64FromObject } from "@/lib/utils";

export default function FishInfo({ data }: { data: ICategory }) {
  const [isUsed, setIsUsed] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkCategoryUsage = async () => {
      const used = await isCategoryUsed(data.id);

      setIsUsed(used);
    };
    checkCategoryUsage();
  }, [data.id]);

  const handleDelete = async () => {
    const response = await deleteCategory({
      id: data.id,
      path: "/dashboard/fish-category",
    });
    if (response) {
      router.push("/dashboard/fish-category");
    }
  };
  return (
    <div>
      <div
        className={`flex w-[300px] md:w-[330px] h-[150px] items-center   justify-between px-10  pl-20 bg-white rounded-xl shadow-sm border border-[#bac5f9]`}
      >
        <div className="">
          {" "}
          {data.img && (
            <Image
              src={`data:image/png;base64,${bufferToBase64FromObject(
                data.img
              )}`}
              width={80}
              height={80}
              alt={data.name as string}
              className="  object-contain"
              unoptimized
            />
          )}
          <span className="text-xl text-center font-medium py-1 block  text-[#3354f4] capitalize">
            {data.name}{" "}
          </span>
        </div>
        <div className="flex flex-col gap-5">
          <Link
            href={`/dashboard/fish-category/${data.id}/update`}
            className="border p-2 rounded-md hover:bg-[#e7e5e5]"
          >
            <Image
              src={"/icons/pen.svg"}
              width={25}
              height={25}
              alt="Edit"
              className="object-contain"
            />
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                disabled={isUsed}
                className={`border p-2 rounded-md  ${
                  isUsed
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:bg-[#e7e5e5]"
                }`}
              >
                <Image
                  src={"/icons/delete-2.svg"}
                  width={25}
                  height={25}
                  alt="Delete"
                  className="object-contain"
                />{" "}
              </button>
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
                  onClick={handleDelete}
                >
                  Continuer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
