import { Card, CardContent } from "@/components/ui/card";
import { getWrappingById } from "@/lib/actions/wrapping.actions";
import { getGroupedWeightTypesWrapping } from "@/lib/actions/wrappingWeightFish.actions";
import { formatFloat } from "@/lib/utils";
import { Calculator } from "lucide-react";
import WeightCategoryList from "./WeightCategoryList";

export default async function WrappingTotalWeightTable({
  wrappingId,
}: {
  wrappingId: number;
}) {
  const groupedWeightTypes = await getGroupedWeightTypesWrapping(wrappingId);
  const wrapping = await getWrappingById(wrappingId);

  if (!groupedWeightTypes) return;
  const difference = (wrapping?.total_weight ?? 0) / (wrapping?.total_weight_receptions ?? 0)
const totalWeight = wrapping?.total_weight ?? 0;

const weightData = (groupedWeightTypes.totalWeightsByType ?? []).map((item) => {
  const percentage = totalWeight
    ? (item.totalWeight / totalWeight) * 100
    : 0;

  return {
    type: item.type,
    totalWeight: item.totalWeight,
    percentage: Number(percentage.toFixed(2)), 
  };
});
  return (
    <section className="w-full mx-auto"> 
      <WeightCategoryList items={weightData} />

      {/* Final Totals Summary */}
      <Card className="bg-blue-50 border-blue-200  w-full sm:w-full mx-auto rounded-xl">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-blue-600" />
            Résumé Final des Totaux
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Espace</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatFloat(wrapping?.total_weight ?? 0)} kg
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Réception</p>
              <p className="text-2xl font-bold text-green-600">
                {formatFloat(wrapping?.total_weight_receptions ?? 0)} kg
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Différence (T - E)</p>
              <p
                className={`text-2xl font-bold ${
                  difference >= 1 ? "text-orange-600" : "text-red-600"
                }`}
              >
                {formatFloat(difference)}  
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
