import HasPermissionsServer from "@/components/auth/HasPermissionsServer";
import { getGroupedWeightTypesWrapping } from "@/lib/actions/wrappingWeightFish.actions";
import { formatFloat } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Pen, Scale } from "lucide-react";
import Link from "next/link";

type ReceptionWeightDetailsParams = {
  wrappingId: number;
  showUpdateBtn: boolean;
};

export default async function WrappingInvoiceTable({
  wrappingId,
  showUpdateBtn,
}: ReceptionWeightDetailsParams) {
  const groupedWeightTypes = await getGroupedWeightTypesWrapping(wrappingId);

  if (!groupedWeightTypes) return;
  const groupedArray = Object.entries(groupedWeightTypes.grouped).map(
    ([name, items]) => ({
      name,
      items,
    })
  );

  return (
    <section className="w-full">
      <h3 className="text-lg py-3 ml-3 font-semibold text-gray-900 flex items-center">
        <Scale className="w-5 h-5 mr-2 text-blue-600" />
        Détails de Poids Groupés par Type
      </h3>
      <div className="flex flex-wrap justify-center gap-4">
        {groupedArray.map((detail, index) => (
          <Card
            key={index}
            className="bg-gray-50 border min-w-[230px] h-fit border-gray-200 rounded-xl"
          >
            <CardContent className="px-2">
              <div className="flex justify-between items-start ">
                <h4 className="font-semibold text-gray-900">{detail.name}</h4>
                <HasPermissionsServer permission="update:weight_fish_wrapping">
                  {showUpdateBtn && (
                    <Link
                      href={`/wrapping-weight-fish?wrappingId=${wrappingId}&typeName=${detail.name}`}
                      className="bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-2 text-sm px-2 rounded-md"
                    >
                      <Pen className="w-[14px]" /> Modifier
                    </Link>
                )}
                </HasPermissionsServer>
                
              </div>

              {/* Weight Entries */}
              <div className="space-y-2 mb-2">
                <p className="text-sm font-medium text-gray-700">
                  Entrées de poids:
                </p>
                {detail.items.map((entry, entryIndex) => (
                  <div
                    key={entryIndex}
                    className="flex justify-between text-sm bg-white p-2 rounded"
                  >
                    <span>{entry.weight} kg</span>
                    <span>{entry.box} caisses</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              {groupedWeightTypes.totalWeightsByType.map((items, index) => {
                return (
                  items.type == detail.name && (
                    <div key={index} className="space-y-2 border-t pt-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Poids Total:</span>
                        <span className="font-semibold">
                          {formatFloat(items.totalWeight)} kg
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Caisses:</span>
                        <span className="font-semibold">
                          {items.totalCrate}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Poids Net:</span>
                        <span className="font-semibold text-green-600">
                          {formatFloat(items.totalWeight)} kg
                        </span>
                      </div>
                    </div>
                  )
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
