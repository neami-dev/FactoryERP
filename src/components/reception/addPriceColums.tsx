"use client";
import { IReception } from "@/interfaces";

import { ColumnDef } from "@tanstack/react-table";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { formatFloat } from "@/lib/utils";
import HasPermissions from "../auth/HasPermissions";
import PrintRecptionInvoivePriceBtn from "../invoice/PrintRecptionInvoivePriceBtn";

export const addPriceColumns: ColumnDef<IReception>[] = [
  {
    accessorKey: "id",
    header: "Numero",
  },
  {
    accessorKey: "created_at",
    header: "Date",
  },
  {
    accessorFn: (row) => row.fish_category?.name ?? "N/A",
    id: "fish_category",
    header: "Espace",
    cell: (info) => (
      <div className="capitalize ">{String(info.getValue())}</div>
    ),
  },
  {
    accessorFn: (row) =>
      row.supplier?.person?.firstname && row.supplier.person.lastname
        ? `${row.supplier.person.firstname} ${row.supplier.person.lastname}`
        : "N/A",
    id: "supplier",
    header: "Fournisseur",
    cell: (info) => <div>{String(info.getValue())}</div>,
  },
  {
    accessorKey: "origin",
    header: "Origine",
  },

  {
    accessorKey: "total_weight_net",
    header: "Q , Espace",
    cell: (info) => (
      <div>{String(formatFloat(info.getValue() as number))} kg</div>
    ),
  },
  {
    header: "Prix Final",
    accessorKey: "final_price",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div>
          {row.original.final_price ? (
            <span className="bg-[#e7fae4] text-[#215538] py-1 px-3 text-base rounded-md">
              {String(formatFloat(row.original.final_price))} Dh
            </span>
          ) : (
            <span className="bg-[#ffdfdf] text-[#914949] py-1 px-3  rounded-md">
              Non
            </span>
          )}
        </div>
      );
    },
  },
  {
    header: "Prix ​​payé",
    id: "paid_price",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div>
          {row.original.final_price ? (
            <span className="bg-[#e7fae4] text-[#215538] py-1 px-3 text-base rounded-md">
              {row.original.paid_price
                ? formatFloat(row.original.paid_price)
                : formatFloat(row.original.final_price)}{" "}
              Dh
            </span>
          ) : (
            <span className="bg-[#ffdfdf] text-[#914949] py-1 px-3  rounded-md">
              Non
            </span>
          )}
        </div>
      );
    },
  },

  {
    header: "Actes",
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
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
            className="bg-[#fcf9f9] z-30 border rounded-xl p-1 w-[180px] shadow text-lg"
            align="center"
          >
            {row.original.final_price ? (
              <HasPermissions permissions={["show_price_details:reception"]}>
                <Link
                  href={`/dashboard/reception/add-price/${row.original.id}`}
                >
                  <DropdownMenuItem className="w-full text-base flex items-center hover:!bg-[#3354f4]/20 cursor-pointer gap-3">
                    <Image
                      src="/icons/zoom.svg"
                      width={20}
                      height={20}
                      alt=""
                    />
                    Voir
                  </DropdownMenuItem>
                </Link>
              </HasPermissions>
            ) : (
              " "
            )}
            <HasPermissions permissions={["download_invoice:reception"]}>
              <PrintRecptionInvoivePriceBtn receptionId={row.original.id} className="text-base !border-0 !shadow-none  !text-gray-700 !rounded-md !bg-transparent !px-1.5 !py-2  w-full hover:!bg-[#3354f4]/20 overflow-hidden" />
            </HasPermissions>
            {row.original.final_price ? <DropdownMenuSeparator /> : " "}
            {row.original.final_price ? (
              <HasPermissions permissions={["edit_price:reception"]}>
                <Link
                  href={`/invoice/reception-weights?receptionId=${row.original.id}`}
                >
                  <DropdownMenuItem className="w-full text-base flex items-center hover:!bg-[#3354f4]/20 cursor-pointer gap-3">
                    <Image
                      src="/icons/edit.svg"
                      width={20}
                      height={20}
                      alt=""
                    />
                    Modifier
                  </DropdownMenuItem>
                </Link>
              </HasPermissions>
            ) : (
              <HasPermissions permissions={["add_price:reception"]}>
                <Link
                  href={`/dashboard/reception/add-price/${row.original.id}`}
                >
                  <DropdownMenuItem className="w-full text-base flex items-center hover:!bg-[#3354f4]/20 cursor-pointer gap-3">
                    <Image
                      src="/icons/add-price.svg"
                      width={20}
                      height={20}
                      alt=""
                    />
                    Ajouter
                  </DropdownMenuItem>
                </Link>
              </HasPermissions>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
