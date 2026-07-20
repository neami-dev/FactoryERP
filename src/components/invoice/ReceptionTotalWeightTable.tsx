import { getReceptionById } from "@/lib/actions/reception.actions";
import { getGroupedWeightTypes } from "@/lib/actions/receptionWeightFish.actions";
import { formatFloat } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { Calculator } from "lucide-react";
import WeightCategoryList from "./wrapping/WeightCategoryList";

export default async function ReceptionTotalWeightTable({
  receptionId,
}: {
  receptionId: number;
}) {
  const groupedWeightTypes = await getGroupedWeightTypes(receptionId);
  const reception = await getReceptionById(receptionId);

  if (!groupedWeightTypes) return;
  const difference =
    (reception?.total_weight_trace ?? 0) - (reception?.total_weight_net ?? 0);
const totalWeight = reception?.total_weight_net ?? 0;
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
    <section className="mx-auto max-w-5xl my-8 ">
       <WeightCategoryList items={weightData} />
      {/* Final Totals Summary */}
      <Card className="bg-blue-50 border-blue-200  w-fit sm:w-full mx-auto rounded-xl">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-blue-600" />
            Résumé Final des Totaux
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Espace</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatFloat(reception?.total_weight_net ?? 0)} kg
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Traçabilité</p>
              <p className="text-2xl font-bold text-green-600">
                {formatFloat(reception?.total_weight_trace ?? 0)} kg
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Différence (T - E)</p>
              <p
                className={`text-2xl font-bold ${
                  difference >= 0 ? "text-orange-600" : "text-red-600"
                }`}
              >
                {difference >= 0 ? "+" : ""}
                {formatFloat(difference)} kg
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
