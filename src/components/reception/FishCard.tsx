"use client";
import { ICategory } from "@/interfaces";
import Image from "next/image";
import { bufferToBase64FromObject } from "@/lib/utils";

interface FishCardProps {
  fish: ICategory;
  onClick: (fish: ICategory) => void;
}

const FishCard: React.FC<FishCardProps> = ({ fish, onClick }) => {
  return (
    <button
      className={`flex flex-col h-[130px] w-[130px]   items-center   justify-center  bg-white rounded-xl shadow-sm border-2 border-[#bac5f9] hover:bg-blue-50 transition-colors cursor-pointer`}
      onClick={() => onClick(fish)}
    >
      {fish.img && (
        <Image
          src={`data:image/png;base64,${bufferToBase64FromObject(fish.img)}`}
          alt={fish.name}
          width={100}
          height={100}
          unoptimized
          className="w-auto h-auto object-contain rounded-xl"
        />
      )}
      {""}
    </button>
  );
};

export default FishCard;
