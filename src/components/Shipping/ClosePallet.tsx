"use client";

import { Button } from "../ui/button";

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

import { updatePallet } from "@/lib/actions/pallet.actions";
import Image from "next/image";
import { toast } from "sonner";

export default function ClosePallet({
  pallet_id,
  handleIsClosed,
}: {
  pallet_id?: number;
  handleIsClosed: (isClosed: boolean) => void;
}) {

  const finishReception = async () => {
    try {
      if (!pallet_id) return;

      const response = await updatePallet({
        data: { id: pallet_id, is_closed: true },
        path: "/shipping-weight-fish/create",
      });

      if (response) {
        toast.success("créé avec succès");
        handleIsClosed(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
     
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className=" cursor-pointer border shadow py-5 text-base bg-white hover:bg-gray-200 text-black">
            <Image
              src="/icons/lock-icon.svg"
              width={20}
              height={20}
              alt=""
              className=" text-[#3354f4] "
            />{" "}
            <p className="hidden sm:block">Fermer la palette</p>
          </Button>
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
              onClick={finishReception}
            >
              Continuer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
