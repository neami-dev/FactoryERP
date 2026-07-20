
import { Card, CardContent } from "@/components/ui/card";
import { Scale, Package, Layers } from "lucide-react";

interface SummaryStats {
  totalWeight: number;
  totalBoxes: number;
  totalPallets: number;
}

interface InvoiceSummaryStatsProps {
  summary?: SummaryStats;
}

const InvoiceSummaryStats = ({ summary }: InvoiceSummaryStatsProps) => {

  
  return (
    <div className="flex flex-wrap justify-evenly items-center gap-6">
      <Card className="min-w-[200px] lg:w-[300px] bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 rounded-xl">
        <CardContent className="p-6 text-center">
          <Scale className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-1">Poids Total</p>
          <p className="text-2xl font-bold text-gray-900">{summary?.totalWeight} kg</p>
        </CardContent>
      </Card>
      
      <Card className="min-w-[200px] lg:w-[300px] bg-gradient-to-br from-green-50 to-green-100 border-green-200 rounded-xl">
        <CardContent className="p-6 text-center">
          <Package className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-1">Total Boîtes</p>
          <p className="text-2xl font-bold text-gray-900">{summary?.totalBoxes}</p>
        </CardContent>
      </Card>
      
      <Card className="min-w-[200px] lg:w-[300px] bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 rounded-xl">
        <CardContent className="p-6 text-center">
          <Layers className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-1">Total Palettes</p>
          <p className="text-2xl font-bold text-gray-900">{summary?.totalPallets}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceSummaryStats;
