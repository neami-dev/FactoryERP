import { getGroupedWeightTypes } from "@/lib/actions/receptionWeightFish.actions";
import InputToAddRecpetionPrice from "./InputToAddRecpetionPrice";
import { getDefaultPrice } from "@/lib/actions/receptionPricing.actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn, formatFloat } from "@/lib/utils";

export default async function TableToAddPrice({
  receptionId,
  showUpdateBtn
}: {
  receptionId: number;
  showUpdateBtn: boolean;
}) {
  const groupedWeightTypes = await getGroupedWeightTypes(receptionId);

  const averagePrice: number =
    (groupedWeightTypes?.totalPrice ?? 0) /
    (groupedWeightTypes?.totalWeightNet ?? 0);
 
  return (
    <section className="w-full mx-auto py-16"> 
     
       <div className="overflow-x-auto rounded-lg border border-gray-200/50 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-100/50 sticky top-0 z-10">
            <TableRow className="border-b border-gray-200/50 hover:bg-gray-100/50">
              <TableHead className="font-semibold text-gray-800 text-left py-4">
                Taille
              </TableHead>
              <TableHead className="font-semibold text-gray-800 text-right py-4 px-6">
                Pourcentage
              </TableHead>
              <TableHead className="font-semibold text-gray-800 text-right py-4 px-6">
                Poids net (kg)
              </TableHead>
              <TableHead className="font-semibold text-gray-800 text-right py-4 px-6">
                Prix au kg
              </TableHead>
              <TableHead className="font-semibold text-gray-800 text-right py-4 pr-8">        
                Prix total
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {groupedWeightTypes?.totalWeightsByType.map(async (item, index) => {
              const result = await getDefaultPrice({
              reception_id: receptionId,
              weight_type_name: item.type,
            });
            const percentage = (item.netWeight / groupedWeightTypes?.totalWeightNet) * 100
           

              return (
                <TableRow key={index} >
                  <TableCell className="font-medium text-gray-800 py-4 px-6">
                    <span className="uppercase tracking-wide text-sm">
                      {item.type}
                    </span>
                  </TableCell>
                  
                  <TableCell className="text-right py-4 px-6">
                    <div className={cn(
                      'inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium',
                      percentage > 50 ? 'bg-green-100 text-green-700' :
                      percentage < 20 ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-600'
                    )}>
                      {formatFloat(percentage)} %
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right py-4 px-6">
                    <span className="font-medium text-gray-700">
                      {formatFloat(item.netWeight)}
                    </span>
                  </TableCell>
                  <InputToAddRecpetionPrice
                          defultValue={result?.price_kg}
                          receptionId={receptionId}
                          showInput={showUpdateBtn}
                          item={item}
                        />
                </TableRow>
              );
            })}

            {/* Total Row */}
            <TableRow className="bg-gray-100/80 border-t-2 border-gray-300/50 hover:bg-gray-100">
              <TableCell className="font-bold text-gray-900 py-4 px-6">
                TOTAL
              </TableCell>
              <TableCell className="text-right py-4 px-6">
                <span className="font-semibold text-gray-700">
                  100.0%
                </span>
              </TableCell>
              <TableCell className="text-right py-4 px-6">
                <span className="font-bold text-gray-900">
                  {formatFloat(groupedWeightTypes?.totalWeightNet ?? 0)}
                </span>
              </TableCell>
              <TableCell className="text-right py-4 px-6">
                <span className="text-sm text-gray-600">
                  Moyenne
                </span>
              </TableCell>
              <TableCell className="text-right py-4 pr-8">
                <span className="font-bold text-gray-900 text-lg">
                  {formatFloat(groupedWeightTypes?.totalPrice ?? 0)}
                </span>
              </TableCell>
            </TableRow>

            {/* Average Price Row */}
            <TableRow className="bg-blue-50/80 border-t border-gray-200/50 hover:bg-blue-50">
              <TableCell className="font-semibold text-blue-900 py-4 px-6">
                PRIX MOYEN
              </TableCell>
              <TableCell className="py-4"></TableCell>
              <TableCell className="py-4"></TableCell>
              <TableCell className="text-right py-4 px-6" >
                <span className="font-bold text-blue-800">
                  {formatFloat(averagePrice)} Dh
                </span>
              </TableCell>
              <TableCell className="text-right py-4 px-6">
                <span className="text-sm text-blue-600">
                  par kg
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
