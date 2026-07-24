import FishCategory from "@/components/FishCategories/FishCategory";
import GoBack from "@/components/others/GoBack";

import { getAllCategories } from "@/lib/actions/fishCategory.actions";

export default async function Fishcategory() {
  const allCategories = await getAllCategories();
  return (
    <section className="w-full h-full py-8 flex flex-col items-center justify-center">
      <div className="w-full flex pl-6 md:pl-12 xl:pl-30">
        <GoBack />
      </div>
      <div className="w-fit h-fit relative">
        <h2 className=" md:text-xl lg:text-2xl text-[#3354f4] text-center font-semibold py-12">
          Toutes les Catégories de Poissons
        </h2>
        <FishCategory fishcategories={allCategories?.data} />
      </div>
    </section>
  );
}
