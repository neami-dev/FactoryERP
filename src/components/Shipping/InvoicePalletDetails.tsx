import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";
interface PalletGroupData {
  total_weight: number;
  total_box: number;
  qualities: string[]; // e.g. ['A', 'B']
}

interface PalletData {
  palletId: number;
  palletNumber: number;
  groups: {
    [wrappingType: string]: {
      [weightType: string]: PalletGroupData;
    };
  };
}

interface PalletTableProps {
  pallets: PalletData[];
}

const InvoicePalletDetails = ({ pallets }: PalletTableProps) => {
  return (
    <Card className="bg-white border border-gray-200 rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <Package className="w-5 h-5 mr-2 text-blue-600" />
          Détails des Palettes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-semibold text-gray-700">
                  N° Palette
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Type d&apos;emballage
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Type de Poisson
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Poids (kg)
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Nombre de Boîtes
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Qualité
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pallets.map((pallet) =>
                Object.entries(pallet.groups).map(
                  ([wrappingType, weightTypes]) =>
                    Object.entries(weightTypes).map(([weightType, data]) => (
                      <TableRow
                        key={`${pallet.palletId}-${wrappingType}-${weightType}`}
                      >
                        <TableCell className="font-semibold text-gray-900">
                          {pallet.palletNumber}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {wrappingType}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {weightType}
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900">
                          {data.total_weight} kg
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900">
                          {data.total_box}
                        </TableCell>
                        <TableCell>
                          {data.qualities.map((q) => (
                            <Badge
                              key={q}
                              variant="outline"
                              className={cn(`font-medium mr-1}]`)}
                            >
                              {q}
                            </Badge>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))
                )
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoicePalletDetails;
