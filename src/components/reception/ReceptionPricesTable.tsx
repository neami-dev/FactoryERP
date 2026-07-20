"use client";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { formatDate } from "@/lib/utils";

import Image from "next/image";
import { getreceptionsValidated } from "@/lib/actions/reception.actions";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { IReception } from "@/interfaces";
import GoBack from "../others/GoBack";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: {
    data: IReception[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export function ReceptionPricesTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [supplierName, setSupplierName] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: receptionsResponse ,isFetched} = useQuery({
    queryKey: ["receptionsValidated", page, limit, supplierName],
    queryFn: async () =>
      await getreceptionsValidated({
        page,
        limit,
        lastnameOrFistname: supplierName,
      }),
    initialData: data,
    // refetchOnWindowFocus: false,
    refetchInterval: 6000,
  });

  const table = useReactTable({
    data: receptionsResponse?.data as TData[],
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
    <section className="mx-auto w-full">
      <div className="flex  items-center justify-between py-4">
        <GoBack />
        <Input
          placeholder="Filtrer par Fournisseur"
          defaultValue={supplierName ?? ""}
          onChange={(event) => setSupplierName(event.target.value)}
          className="w-[230px]"
        />
      </div>
      <div className="border  rounded-md">
        <Table className="w-full mx-auto">
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
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {receptionsResponse?.total || 0 > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`text-base`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className={`text-center px-10 font-medium text-gray-600  `}
                      key={cell.id}
                    >
                      {
                        cell.column.id === "created_at"
                          ? formatDate(cell.getValue() as string) // Format the date
                          : flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
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
                  className="h-24 text-center"
                >
                    {  
                      isFetched &&
                      receptionsResponse?.total === 0 ? (
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
      <div className="flex flex-col items-end p-4 w-full  ">
        {/* Help text */}
        <span className="text-sm text-gray-700 dark:text-gray-400">
          Page{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {receptionsResponse?.page}
          </span>{" "}
          sur{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {receptionsResponse?.totalPages}
          </span>{" "}
          —{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {receptionsResponse?.total}
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
            <ArrowLeft /> Previous
          </Button>
          <Button
            size="lg"
            className="bg-[#3354f4]/90 hover:bg-[#3354f4] cursor-pointer"
            onClick={() =>
              setPage((prev) =>
                Math.min(prev + 1, receptionsResponse?.totalPages || 1)
              )
            }
            disabled={
              (page === receptionsResponse?.totalPages ||
                receptionsResponse?.totalPages === 0) &&
              true
            }
          >
            Next <ArrowRight />
          </Button>
        </div>
      </div>
    </section>
    //useInfiniteQuery
  );
}
