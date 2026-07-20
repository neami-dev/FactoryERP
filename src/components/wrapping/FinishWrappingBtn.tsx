"use client";

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
import { updateWrapping } from "@/lib/actions/wrapping.actions";

export default function FinishWrappingBtn({
  wrappingId,
}: {
  wrappingId: number;
}) {
  const route = useRouter();
  const finishReception = async () => {
    try {
      const updatedWrapping = await updateWrapping({
        wrapping: { id: Number(wrappingId), isFinished: true },
        path: "/wrapping/history",
      });

      if (updatedWrapping) {
        route.replace(`/invoice/wrapping-weights?wrappingId=${wrappingId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className=" cursor-pointer py-5 text-base bg-white hover:bg-gray-200 text-black">
            <BookmarkCheck className=" text-[#3354f4] " /> <p className="hidden sm:block">Terminer</p>
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
