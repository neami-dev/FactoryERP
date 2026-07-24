"use client";
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
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { IRole, IUser } from "@/interfaces";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

import { Edit, MoreHorizontal, Trash2 } from "lucide-react";

import {
  ColumnDef,
  flexRender,
  getPaginationRowModel,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import UserForm from "./UserForm";
import { deleteUser } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import HasPermissions from "../auth/HasPermissions";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: {
    data: IUser[];
    total: number;
    page: number;
    totalPages: number;
  };
  roles?: IRole[];
}

export function UsersTable<TData, TValue>({
  data,
  columns,
  roles,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
console.log(data);

  const [page, setPage] = useState(1);
  const [lastnameOrFistname, setLastnameOrFistname] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<IUser | undefined>(undefined);
  const queryClient = useQueryClient();

  const limit = 10;


  const handleManualRefetch = () => {
    queryClient.invalidateQueries({
      queryKey: ["users", page, limit, lastnameOrFistname],
    });
  };
  const table = useReactTable({
    data: data?.data as TData[],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });
  const handleDelete = async (user: IUser) => {
    const userId = user.id;
    const deleted = await deleteUser(userId, "/dashboard/users");
    if (deleted) {
      toast.success("Rôle supprimé avec succès!");
      handleManualRefetch();
    } else {
      toast.error("Échec de la suppression du rôle. Veuillez réessayer.");
    }
  };
  return (
    <section className="w-full p-5">
      <div className="flex justify-between items-center py-4">
        <Input
          placeholder="Filtrer par prénom ou nom"
          defaultValue={lastnameOrFistname ?? ""}
          onChange={(event) =>
            setTimeout(() => {
              setLastnameOrFistname(event.target.value);
              setPage(1);
            }, 1000)
          }
          className="w-[230px]"
        />
        <HasPermissions permissions={["create:user"]}>
          {" "}
          <Button
            className="bg-[#3354f4] cursor-pointer !px-7 text-base py-5 hover:bg-[#3354f4]/90"
            onClick={() => {
              setAddDialogOpen(true);
            }}
          >
            <Plus className="mr-1 h-4 w-4" />
            Ajouter
          </Button>
        </HasPermissions>
      </div>
      <div className="border rounded-md relative w-full">
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="px-3" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="text-base text-gray-800 text-center"
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
                <TableHead className="text-base text-gray-800 text-center">
                  Actes
                </TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {data?.total || 0 > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`text-base`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className={`text-center px-3 font-medium text-gray-700  `}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="cursor-pointer  bg-gray-300 hover:bg-gray-400 "
                        asChild
                      >
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 cursor-pointer"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="bg-[#fcf9f9] mr-4 opacity-100   z-30 border flex flex-col gap-2 py-2 rounded-xl p-1 w-[160px] shadow"
                        align="center"
                      >
                        <HasPermissions permissions={["update:user"]}>
                          {" "}
                          <DropdownMenuItem
                            onClick={() => {
                              setFormData(row.original as IUser);
                              setEditDialogOpen(true);
                            }}
                            className="w-full  text-base flex items-center hover:!bg-[#3354f4]/20 cursor-pointer gap-3"
                          >
                            <Edit className="h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                        </HasPermissions>
                        <HasPermissions permissions={["delete:user"]}>
                          <div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button className="w-full text-base flex items-center py-1.5 px-2 rounded-md hover:!bg-[#3354f4]/20 cursor-pointer gap-3">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                  Supprimer
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Êtes-vous absolument sûr ?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete account and remove data
                                    from servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="cursor-pointer">
                                    Annuler
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDelete(row.original as IUser)
                                    }
                                    className="bg-red-700 hover:bg-red-800 cursor-pointer"
                                  >
                                    Continuer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </HasPermissions>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {

                    data?.total === 0 ? (
                      <h2 className="text-base font-semibold">
                        Aucun résultat.
                      </h2>
                    ) :
                      <div className="w-full h-[300px] flex justify-center items-center">
                        <Image
                          src="/icons/infinite-spinner-loading.svg"
                          alt="loading"
                          width={100}
                          height={100}
                        />
                      </div>
                  }
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col items-end p-4 w-full">
        {/* Help text */}
        <span className="text-sm text-gray-700 dark:text-gray-400">
          Page{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {data?.page}
          </span>{" "}
          sur{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {data?.totalPages}
          </span>{" "}
          —{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {data?.total}
          </span>{" "}
          entrées au total
        </span>
        <div className="flex w-full items-center justify-end space-x-2 py-4">
          <Button
            size="lg"
            className="bg-[#3354f4]/90 hover:bg-[#3354f4] cursor-pointer"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            <ArrowLeft /> Précédent
          </Button>
          <Button
            size="lg"
            className="bg-[#3354f4]/90 hover:bg-[#3354f4] cursor-pointer"
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, data?.totalPages || 1))
            }
            disabled={
              (page === data?.totalPages ||
                data?.totalPages === 0) &&
              true
            }
          >
            Suivant <ArrowRight />
          </Button>
        </div>
      </div>
      {/* Add User Dialog  */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[850px] overflow-x-auto rounded-md">
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
            <DialogDescription>
              Créez un nouveau compte utilisateur avec des autorisations basées
              sur les rôles.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <UserForm
              roles={roles}
              type="Create"
              onSubmit={() => {
                handleManualRefetch();
                setAddDialogOpen(false);
              }}
              onCancel={() => setAddDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[850px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <UserForm
              initialData={formData}
              userId={formData?.id}
              roles={roles}
              type="Update"
              onSubmit={() => {
                handleManualRefetch();
                setAddDialogOpen(false);
              }}
              onCancel={() => setEditDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
