import FishForm from "@/components/FishCategories/FishForm";
import { getCategoryById } from "@/lib/actions/fishCategory.actions";
import { XIcon } from "lucide-react";
import Link from "next/link";
type UpdateFishProps = {
  params: Promise<{ id: number }>;
};
export default async function UpdateFish({ params }: UpdateFishProps) {
  const { id } = await params;
  const response = await getCategoryById(id);
  return (
    <section className="flex flex-col  items-center py-12 w-full min-h-screen relative">
      <Link
        href={`/dashboard/fish-category/${id}`}
        className=" cursor-pointer   absolute top-9 right-5 lg:right-15 xl:right-[220px]  bg-red-600 rounded-md p-1 text-white hover:bg-red-700"
      >
        <XIcon className="w-[24px] h-[24px]  md:w-[30px] md:h-[30px]  " />
      </Link>

      <div className="text-center text-2xl text-[#3354f4] py-8 font-semibold pt-8">
        Modifier Poissons
      </div>

      <FishForm
        type="Update"
        fishCategory={response?.data}
        fishCategoryId={response?.data?.id}
      />
    </section>
  );
}
