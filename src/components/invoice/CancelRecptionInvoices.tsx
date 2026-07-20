"use client";
import { updateReception } from "@/lib/actions/reception.actions";
import { Button } from "@/components/ui/button";
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
import { InvoiceStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
export default function CancelRecptionInvoices({
  receptionId,
}: {
  receptionId: number;
}) {
  const route = useRouter();
  // if a weigher don't have any invoice
  const cancelInvoices = async () => {
    const updatedReception = await updateReception({
      reception: { id: receptionId, invoiceStatus: InvoiceStatus.HAVENOT },
      path: ["/reception-fish/create"],
    });

    if (updatedReception) {
      route.push(`/reception-weight-fish/create?receptionId=${receptionId}`);
    }
  };
  return (
    <section>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="bg-red-600 hover:bg-red-700 cursor-pointer text-lg">
            Aucune Traçabilité
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={cancelInvoices}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
