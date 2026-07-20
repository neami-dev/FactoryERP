"use client";
import { ICategory } from "@/interfaces";
import React from "react";
import FishCard from "../reception/FishCard";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type FishCategoryProps = {
  fishcategories: ICategory[] | undefined;
};
export default function FishCategory({ fishcategories }: FishCategoryProps) {
  const router = useRouter();
  return (
    <div className=" flex flex-wrap h-full max-w-3xl  items-center justify-center gap-6 w-full">
      {fishcategories?.length === 0 && (
        <div className="text-center text-gray-500 col-span-2 md:col-span-3">
          Aucune espace disponible.
        </div>
      )}
      {fishcategories?.map((fish) => (
        <div key={fish.id} className="flex flex-col">
          {" "}
          <FishCard
            fish={fish}
            onClick={() => router.push(`/dashboard/fish-category/${fish.id}`)}
          />{" "}
          <span className="text-lg font-medium text-center  text-[#3354f4] capitalize">
            {fish.name}
          </span>
        </div>
      ))}
      <Link
        href={"/dashboard/fish-category/create"}
        className={`flex flex-col  w-[130px] h-[130px] mb-5 items-center   justify-center p-6 bg-white rounded-xl shadow-sm border border-[#3354f4] hover:bg-blue-50 transition-colors cursor-pointer`}
      >
        <Image
          src={"/icons/sample-add-blue.svg"}
          width={60}
          height={60}
          alt=""
          className="w-[36px]"
        />{" "}
      </Link>
       
    </div>
  );
}
