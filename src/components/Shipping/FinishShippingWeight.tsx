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
import { updateShipping } from "@/lib/actions/shipping.actions";

export default function FinishShippingWeight({
  shippingId,
}: {
  shippingId: number;
}) {
  const route = useRouter();
  const finishShipping = async () => {
    const updatedShipping = await updateShipping({
      shipping: { id: shippingId, isFinished: true },
      path: "/shipping/history",
    });

    if (updatedShipping) {
      route.replace(`/invoice/shipping-weights?shippingId=${shippingId}`);
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
              onClick={finishShipping}
            >
              Continuer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
