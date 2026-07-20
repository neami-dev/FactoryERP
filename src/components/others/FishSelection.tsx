"use client"
import FishCard from "../reception/FishCard";
import { ICategory } from "@/interfaces";

type FishSelectionProps = {
  fishcategories: ICategory[] | undefined;
  handleSelectedId: (id: number) => void;
};
export default function FishSelection({
  fishcategories,
  handleSelectedId,
}: FishSelectionProps) {
  return (
    <>
      <div className=" flex flex-wrap h-full overflow-y-auto items-center justify-center gap-6 w-full">
        {fishcategories?.length === 0 && (
          <div className="text-center text-gray-500 col-span-2 md:col-span-3">
            Aucune espace disponible.
          </div>
        )}

        {fishcategories?.map((fish) => (
          <div key={fish.id} className="flex flex-col">
            <FishCard
              key={fish.id}
              fish={fish}
              onClick={() => handleSelectedId(fish.id)}
            />
            <span className="text-lg font-medium text-center  text-[#3354f4] capitalize">
              {fish.name}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
