"use client";
import { IUser } from "@/interfaces";
import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const usercolumns: ColumnDef<IUser>[] = [
  {
    accessorKey: "id",
    header: "Numero",
  },
  {
    accessorFn: (row: IUser) => row.person?.created_at ?? "N/A",
    id: "created_at",
    header: "Date",
    cell: (info) => <div>{formatDate(info.getValue() as string)}</div>,
  },
  {
    accessorFn: (row: IUser) => row.username ?? "N/A",
    id: "username",
    header: "nom d'utilisateur",
  },
  {
    accessorFn: (row: IUser) => row.person?.firstname ?? "N/A",
    id: "firstname",
    header: "Prénom",
  },
  {
    accessorFn: (row: IUser) => row.person?.lastname ?? "N/A",
    id: "lastname",
    header: "Nom",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "person.phone_number",
    id: "phone_number",
    header: "Téléphone",
    cell: ({ row }) => {
      const phone = row.original.person?.phone_number;
      return phone ? (
        phone
      ) : (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          nul
        </span>
      );
    },
  },
  {
    accessorFn: (row: IUser) => row.role?.name ?? "N/A",
    id: "rôle",
    header: "Rôle",
    cell: (info) => <div className="capitalize">{String(info.getValue())}</div>,
  },
  {
    accessorKey: "auth_allowed",
    id: "auth_allowed",
    header: "Autorisé",
    cell: ({ row }) => {
      const value = row.original.auth_allowed;

      return value ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Oui
        </span>
      ) : (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Non
        </span>
      );
    },
  },
];
