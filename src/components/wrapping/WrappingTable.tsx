"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getAllWrappings } from "@/lib/actions/wrapping.actions";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { IWrapping } from "@/interfaces";
import GoBack from "../others/GoBack";
import { formatDate } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: {
    data: IWrapping[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export function WrappingTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [page, setPage] = useState(1);
  const [clientName, setClientName] = useState("");
  const limit = 10;

  const {
    data: wrappingsResponse,
    isFetched
  } = useQuery({
    queryKey: ["wrappings", page, limit, clientName],
    queryFn: async () =>
      await getAllWrappings({ page, limit, lastnameOrFistname: clientName }),
    initialData: data,
    refetchInterval: 6000,
  });

  const table = useReactTable({
    data: wrappingsResponse?.data as TData[],
    columns,
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

  return (
    <section className="w-full p-5">
      <div className="flex items-center justify-between py-4">
        <GoBack />
        <Input
          placeholder="Filtrer par Client"
          defaultValue={clientName}
          onChange={(event) =>
            setTimeout(() => {
              setClientName(event.target.value);
              setPage(1);
            }, 1000)
          }
          className="w-[230px]"
        />
      </div>
      <div className="border rounded-md relative w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-base text-gray-800 text-center"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {wrappingsResponse?.total || 0 > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-center px-3 font-medium text-gray-700  "
                    >
                      {
                        cell.column.id === "created_at" ? (
                          formatDate(cell.getValue() as string) // Format the date
                        ) : cell.column.id === "isValid" ? (
                          cell.getValue() === true ? (
                            <span className="bg-[#b9d9b3] text-[#175030] py-1 px-6 rounded-md">
                              validé
                            </span> // If the value is true, display "finish"
                          ) : (
                            <span className="bg-[#ffdfdf] text-[#662626] py-1 px-3  rounded-md">
                              Non validé
                            </span>
                          ) // If the value is false, display "not finish"
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        ) // Default rendering for other columns
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-24"
                >
           
                    
                

                  {  
                    isFetched &&
                    wrappingsResponse?.total === 0 ? (
                      <h2 className="text-base font-semibold">
                        Aucun résultat.
                      </h2>
                    ):
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
            {wrappingsResponse?.page}
          </span>{" "}
          sur{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {wrappingsResponse?.totalPages}
          </span>{" "}
          —{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {wrappingsResponse?.total}
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
              (page === wrappingsResponse?.totalPages ||
                wrappingsResponse?.totalPages === 0) &&
              true
            }
          >
            Suivant <ArrowRight />
          </Button>
        </div>
      </div>
    </section>
  );
}
