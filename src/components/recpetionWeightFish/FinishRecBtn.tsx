"use client";

import { updateReception } from "@/lib/actions/reception.actions";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { BookmarkCheck } from "lucide-react";
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

export default function FinishRecBtn({ receptionId }: { receptionId: number }) {
  const route = useRouter();
  const finishReception = async () => {
    const updatedReception = await updateReception({
      reception: { id: receptionId, isFinished: true },
      path: ["/reception/history"],
    });

    if (updatedReception) {
      route.replace(`/invoice/reception-weights?receptionId=${receptionId}`);
    }
  };
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className=" cursor-pointer py-5 text-base bg-white hover:bg-gray-200 text-black">
            <BookmarkCheck className=" text-[#3354f4] " /> Terminer
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
