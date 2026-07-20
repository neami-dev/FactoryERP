"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ICategory } from "@/interfaces";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
interface Recepetion {
    id: number;
    plate_number: string;
    created_at: Date;
    origin: string;
    weigher_id: number;
    isFinished: boolean;
    supplier_id: number;
    supplier: {
        person: {
        name: string;
        };
    };
}
export interface IReceptionCategory {
  id: number;
  fish_category_id: number;
  reception_id: number;
  quantity: number;
  reception: Recepetion;
  fish_category: ICategory;
  created_at: Date;
}
export const receptionCategoryColumns: ColumnDef<IReceptionCategory>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "created_at",
    header: "Créé à",
  },
  {
    accessorKey: "plate_number",
    header: "Matricul camion",
  },

 
  {
    accessorKey: "origin",
    header: "Origine",
  },
  {
    accessorKey: "weigher_id",
    header: "Peseur",
  },
  {
    accessorKey: "isFinished",
    header: "Est terminé",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-[#ebebeb] border rounded-xl p-2 shadow"
            align="end"
          >
            <DropdownMenuLabel className="text-black">Actes</DropdownMenuLabel>

            <DropdownMenuSeparator />
            <Link href={`/dashborad/receptions/${row.original.id}`}>
              <DropdownMenuItem> Détails</DropdownMenuItem>
            </Link>

            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
