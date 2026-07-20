import {
  getInvoicesByReception,
  getTotalWeightTracByReception,
} from "@/lib/actions/invoice.actions";
import { formatDate, formatFloat } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  Calendar,
  Building,
  Hash,
  Scale,
  Pen,
  CirclePlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import HasPermissionsServer from "../auth/HasPermissionsServer";
import Image from "next/image";

export default async function ReceptionComapnyInvoicesTable({
  showUpdateBtn,
  receptionId,
}: {
  showUpdateBtn: boolean;
  receptionId: number;
}) {
  const result = await getInvoicesByReception(receptionId);

  const totalWeightTrace = await getTotalWeightTracByReception(receptionId);
  return (
    <>
      <div className="space-y-4  max-w-5xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Package className="w-5 h-5 mr-2 text-blue-600" />
          Tableau des Factures de Traçabilité
        </h3>
        {showUpdateBtn && (
          <HasPermissionsServer permission="create:traceability_invoice">
            <Link
              href={`/traceability/create?receptionId=${receptionId}`}
              className="bg-blue-100 w-fit text-blue-700 border border-blue-200 flex items-center gap-2 font-medium px-3 py-1 rounded-md"
            >
              <CirclePlus className="w-[14px]" /> Ajouter
            </Link>
          </HasPermissionsServer>
        )}
        <Card className="bg-white border p-0 border-gray-200 rounded-xl">
          <CardContent className="p-0 w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">
                    <div className="flex items-center">
                      <Hash className="w-4 h-4 mr-1" />
                      ID Facture
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Date de Création
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      Marayeur
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-1" />
                      Code Traçabilité
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-right">
                    <div className="flex items-center justify-end">
                      <Scale className="w-4 h-4 mr-1" />
                      Poids Total
                    </div>
                  </TableHead>
                  {showUpdateBtn && (
                    <HasPermissionsServer permission="update:traceability_invoice">
                      <TableHead className="font-semibold text-gray-900 text-center">
                        Actions
                      </TableHead>
                    </HasPermissionsServer>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {result?.data.length === 0 && (
                  <TableRow className="hover:bg-gray-50">
                    <TableCell colSpan={6} className="font-medium">
                      <div className="mx-auto flex justify-center items-center gap-5 text-xl py-6 font-semibold">
                        <Image
                          src="/icons/empty.svg"
                          alt="edit"
                          width={40}
                          height={40}
                          className="cursor-pointer "
                        />
                        Aucune donnée.
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {result?.data.map((invoice, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {invoice.id}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {formatDate(String(invoice.created_at))}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {invoice.company.name}
                    </TableCell>
                    <TableCell>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {invoice.trace_code}
                      </code>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-gray-900">
                      {invoice.total_weight} kg
                    </TableCell>
                    {showUpdateBtn && (
                      <HasPermissionsServer permission="update:traceability_invoice">
                        <TableCell className="text-right font-semibold text-gray-900">
                          <Link
                            href={`/traceability/${invoice.id}/update`}
                            className="bg-blue-100 text-blue-700 border border-blue-200 w-fit flex items-center gap-2 text-sm px-2 mx-auto rounded-md"
                          >
                            <Pen className="w-[14px]" /> Modifier
                          </Link>
                        </TableCell>
                      </HasPermissionsServer>
                    )}
                  </TableRow>
                ))}

                {/* Total Row */}
                <TableRow className="bg-blue-50 border-t-2 border-blue-200">
                  <TableCell
                    colSpan={4}
                    className="font-semibold text-gray-900"
                  >
                    Total Général
                  </TableCell>
                  <TableCell
                    colSpan={showUpdateBtn ? 2 : 1}
                    className="text-center font-bold text-blue-600 text-lg"
                  >
                    {formatFloat(totalWeightTrace ?? 0)} kg
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
