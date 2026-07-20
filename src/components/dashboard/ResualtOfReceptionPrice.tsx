import InputToAddRecpetionPriceTace from "./InputToAddRecpetionPriceTrace";
import { getReceptionById } from "@/lib/actions/reception.actions";
import PrintRecptionInvoivePriceBtn from "../invoice/PrintRecptionInvoivePriceBtn";
import PaidPrice from "../invoice/PaidPrice";
import { formatFloat } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
export default async function ResualtOfReceptionPrice({
  receptionId,
  showUpdateBtn,
}: {
  receptionId: number;
  showUpdateBtn: boolean;
}) {
  const reception = await getReceptionById(receptionId);

  const deffBetweenTracAndRes: number =
    (reception?.total_weight_trace ?? 0) - (reception?.total_weight_net ?? 0);
 

  return (
    <section className="w-full mx-auto my-12">
      <div className="overflow-x-auto rounded-lg border border-gray-200/50 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-100/50 sticky top-0 z-10">
            <TableRow className="border-b border-gray-200/50 hover:bg-gray-100/50">
              <TableHead className="font-semibold text-gray-800 text-center py-4">
                Total de traçabilité
              </TableHead>
              <TableHead className="font-semibold text-gray-800 text-center py-4">
                Total d&apos;space
              </TableHead>
              <TableHead className="font-semibold text-gray-800 text-center py-4 ">
                déférence (E-T)
              </TableHead>
              <TableHead className="font-semibold text-gray-800 text-center py-4 ">
                Prix par (kg)
              </TableHead>
              <TableHead className="font-semibold text-gray-800 text-center pr-8">
                Prix total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium text- text-gray-800 py-4  text-center">
                <span className=" tracking-wide text-lg">
                  {formatFloat(reception?.total_weight_trace ?? 0)} kg
                </span>
              </TableCell>

              <TableCell className="font-medium text-gray-800 py-4  text-center">
                <span className=" tracking-wide text-lg">
                  {formatFloat(reception?.total_weight_net ?? 0)} kg
                </span>
              </TableCell>

              <TableCell className="font-medium text-gray-800 py-4  text-center">
                <span className=" tracking-wide text-lg">
                  {formatFloat(deffBetweenTracAndRes)} kg
                </span>
              </TableCell>

              <InputToAddRecpetionPriceTace
                totalWeightTrace={deffBetweenTracAndRes}
                defultValue={reception?.untraced_price_kg}
                receptionId={receptionId}
                showInput={showUpdateBtn}
              />
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center gap-6 my-10">
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <span className="font-semibold text-green-800 text-base">
                Prix Final:
              </span>
              <span className="font-bold text-green-900 text-xl bg-green-100 px-4 py-2 rounded-lg">
                {formatFloat(reception?.final_price ?? 0)} Dh
              </span>
            </li>
          </ul>
        </div>

        {(showUpdateBtn || (reception?.paid_price && !showUpdateBtn)) && (
          <PaidPrice
            defaultValue={reception?.paid_price}
            receptionId={receptionId}
            showInput={showUpdateBtn}
          />
        )}
        {showUpdateBtn && (
          <>
            <PrintRecptionInvoivePriceBtn
              receptionId={receptionId}
            />
        
          </>
        )}
      </div>
    </section>
  );
}
