import FishForm from "@/components/FishCategories/FishForm";
import { XIcon } from "lucide-react";
import Link from "next/link";

export default function CreateFish() {
  return (
    <section className="flex flex-col  items-center py-12 w-full  relative">
      <Link
        href={"/dashboard/fish-category"}
        className=" cursor-pointer   absolute top-9 right-5 lg:right-15 xl:right-[220px]  bg-red-600 rounded-md p-1 text-white hover:bg-red-700"
      >
        <XIcon className="w-[24px] h-[24px]  md:w-[30px] md:h-[30px]  " />
      </Link>

      <div className="text-center text-2xl text-[#3354f4] py-8 font-semibold pt-8">
        Ajouter Poissons
      </div>

      <FishForm type="Create" />
    </section>
  );
}
