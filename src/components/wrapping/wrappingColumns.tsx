"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IWrapping } from "@/interfaces";
import { formatDate, formatFloat } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { deleteWrapping, updateWrapping } from "@/lib/actions/wrapping.actions";
import HasPermissions from "../auth/HasPermissions";
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
export const wrappingColumns: ColumnDef<IWrapping>[] = [
  {
    accessorKey: "id",
    header: "Numéro",
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
  {
    accessorFn: (row) => row.fish_category?.name ?? "N/A",
    id: "category",
    header: "Espèce",
  },
  {
    accessorKey: "total_weight_receptions",
    header: "Q , Receptions",
    cell: (info) => (
      <div>{formatFloat((info.getValue() as number) ?? 0)} kg</div>
    ),
  },
  {
    accessorKey: "total_weight",
    header: "Q , Poisson",
    cell: (info) => (
      <div>{formatFloat((info.getValue() as number) ?? 0)} kg</div>
    ),
  },

  {
    accessorFn: (row) =>
      row.client?.person?.firstname && row.client.person.lastname
        ? `${row.client.person.firstname} ${row.client.person.lastname}`
        : "N/A",
    id: "client",
    header: "Client",
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
    header: "Statut",
    cell: ({ getValue }) =>
      getValue() ? (
        <Image
          src="/icons/completed.svg"
          className="mx-auto"
          width={30}
          height={30}
          alt="completed"
        />
      ) : (
        <Image
          src="/icons/pending.svg"
          className="mx-auto animate-spin"
          width={26}
          height={26}
          alt="pending"
        />
      ),
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
       const validated =  await updateWrapping({
          wrapping: {
            id,
            isValid: true,
          },
          path: "/dashboard/wrapping",
        });
        if (validated) {
           toast.success("Validation réussie avec succès !");
        }else{
          toast.error("Échec de la validation. Veuillez réessayer.");

        }
      };
      const handleDelete  = async(id:number)=>{
       const deleted =  await deleteWrapping({id,path:"/dashboard/warapping"});

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
            <HasPermissions permissions={["details:wrapping"]}>
              <Link
                className=""
                href={`/invoice/wrapping-weights?wrappingId=${row.original.id}`}
              >
                <DropdownMenuItem className="w-full text-base flex items-center hover:!bg-[#3354f4]/20 cursor-pointer gap-3">
                  <Image src="/icons/zoom.svg" width={20} height={20} alt="" />
                  Voir
                </DropdownMenuItem>
              </Link>
            </HasPermissions>
             <HasPermissions permissions={["delete:wrapping"]}>
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
              <HasPermissions permissions={["validate:wrapping"]}>
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
