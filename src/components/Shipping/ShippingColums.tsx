"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { IShipping } from "@/interfaces";
import { formatFloat } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HasPermissions from "../auth/HasPermissions";
import { deleteShipping, updateShipping } from "@/lib/actions/shipping.actions";
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
import { toast } from "sonner";
export const ShippingColums: ColumnDef<IShipping>[] = [
  {
    accessorKey: "id",
    header: "Numero",
  },
  {
    accessorKey: "created_at",
    header: "Date",
  },
  {
    accessorFn: (row) =>
      row.shipping_Fish_category?.map((shi) => shi.fish_category?.name) ??
      "N/A",
    id: "fish_category",
    header: "Espace",
    cell: (info) => <div className="capitalize">{String(info.getValue())}</div>,
  },

  {
    accessorFn: (row) =>
      row.client?.person?.firstname && row.client.person.lastname
        ? `${row.client.person.firstname} ${row.client.person.lastname}`
        : "N/A",
    id: "client",
    header: "Client",
    cell: (info) => <div>{String(info.getValue())}</div>,
  },
  {
    accessorKey: "total_weight",
    header: "Poids total",
    cell: (info) => (
      <div>{formatFloat((info.getValue() as number) ?? 0)} kg</div>
    ),
  },
  {
    accessorKey: "total_pallets",
    header: "Palettes",
    cell: (info) => <div>{String(info.getValue())}</div>,
  },
  {
    accessorFn: (row) =>
      row.weigher?.person?.firstname && row.weigher.person.lastname
        ? `${row.weigher.person.firstname} ${row.weigher.person.lastname}`
        : "N/A",
    id: "weigher",
    header: "Peseur",
    cell: (info) => <div>{String(info.getValue())}</div>,
  },
  {
    accessorKey: "isFinished",
    header: "Status", // or whatever label you want
    cell: ({ row }) => {
      const isFinished = row.getValue("isFinished");
      return (
        <div className={`w-[50px]`}>
          {isFinished ? (
            <span className="py-1 px-2.5 border-none rounded-md bg-green-100 text-green-800 font-medium">
              Terminé
            </span>
          ) : (
            <span className="py-1 px-2.5 border-none rounded-md bg-blue-100 text-blue-800 font-medium">
              En cours
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "isValid",
    header: "Validé",
  },
  {
    header: "Actes",
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const handleValid = async (id: number) => {
       const validated = await updateShipping({
          shipping: { id, isValid: true },
          path: "/dashborad/shipping",
        });
         if (validated) {
           toast.success("Validation réussie avec succès !");
        }else{
          toast.error("Échec de la validation. Veuillez réessayer.");

        }
      };
       const handleDelete  = async(id:number)=>{
        const deleted =  await deleteShipping({id,path:"/dashboard/shipping"});

        if (deleted?.success) {
          toast.success("Suppression effectuée avec succès.");
        } else {
          toast.error("Échec de la suppression. Veuillez réessayer.");
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="cursor-pointer bg-gray-300 hover:bg-gray-400 "
            asChild
          >
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-[#fcf9f9] z-30 border rounded-xl p-1 w-[160px] shadow text-lg"
            align="center"
          >
            <HasPermissions permissions={["details:shipping"]}>
              <Link
                className=""
                href={`/invoice/shipping-weights?shippingId=${row.original.id}`}
              >
                <DropdownMenuItem className="w-full text-base flex items-center hover:!bg-[#3354f4]/20 cursor-pointer gap-3">
                  <Image src="/icons/zoom.svg" width={20} height={20} alt="" />
                  Voir
                </DropdownMenuItem>
              </Link>
            </HasPermissions>
            <HasPermissions permissions={["delete:shipping"]}>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                                  <button
                                    className="w-full text-base flex items-center hover:!bg-[#3354f4]/20 cursor-pointer px-2 py-1 rounded gap-3"
                                  >
                                    
                                      <Image src="/icons/delete.svg" width={20} height={20} alt="" />
                                      Supprimer
                               
                                  </button>
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
                                  onClick={()=>handleDelete(row.getValue("id"))}
                                >
                                  Continuer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
              </HasPermissions>
            {!row.original.isValid && row.original.isFinished && (
              <HasPermissions permissions={["validate:shipping"]}>
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleValid(row.getValue("id"))}
                    className="w-full text-base flex items-center hover:!bg-[#3354f4]/20 cursor-pointer gap-3"
                  >
                    <Image
                      src="/icons/validate.svg"
                      width={20}
                      height={20}
                      alt=""
                    />
                    Valide
                  </DropdownMenuItem>
                </>
              </HasPermissions>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
