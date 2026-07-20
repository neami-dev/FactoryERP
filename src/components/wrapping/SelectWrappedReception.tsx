import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import SelectWrappedReceptionTable from "./SelectWrappedReceptionTable";
import { IReception } from "@/interfaces";

export default function SelectWrappedReception({
  receptions,
}: {
  receptions?: IReception[];
}) {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            className=" cursor-pointer  py-5 text-base text-black flex items-center gap-2 hover:bg-blue-100"
          >
            <Image
              src="/icons/view-list-blue.svg"
              alt="View List"
              width={20}
              height={20}
            />
            <p className="hidden sm:block">Repetions</p>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full h-screen flex flex-col items-center   rounded-lg shadow-sm border border-blue-100 ">
          <DialogHeader>
            <DialogTitle className="text-center mt-20 py-5 text-[#3354f4] font-bold md:text-2xl">
              Sélectionner les Réceptions Terminées
            </DialogTitle>

            <DialogDescription className="flex justify-center items-center  gap-2   text-xl font-medium text-gray-800 "></DialogDescription>
            <SelectWrappedReceptionTable receptions={receptions} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
