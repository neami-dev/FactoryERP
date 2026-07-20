import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InvoiceClientInfo from "@/components/invoice/shipping/InvoiceClientInfo";
import InvoiceSummaryStats from "@/components/invoice/shipping/InvoiceSummaryStats";
import InvoiceQualityBreakdown from "@/components/invoice/shipping/InvoiceQualityBreakdown";
import { ArrowsUpFromLine, Box, Eye, Fish } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import InvoicePalletDetails from "@/components/Shipping/InvoicePalletDetails";
import {
  getQualityBreakdownByShippingId,
  getShippingById,
  getShippingTotalsById,
  getWrappingTypeBreakdownByShippingId,
} from "@/lib/actions/shipping.actions";
import { formatDate } from "@/lib/utils";
import Header from "@/components/others/Header";
import { groupShippingWeightByWrappingWithPallets } from "@/lib/actions/pallet.actions";
import PrintShippingInvoiceBtn from "@/components/invoice/shipping/PrintShippingInvoiceBtn";
import Link from "next/link";
import HasPermissionsServer from "@/components/auth/HasPermissionsServer";

type InvoiceWeightsProps = {
  searchParams: Promise<{ shippingId: number; download?: boolean }>;
};

export default async function InvoiceRecptionWeights({
  searchParams,
}: InvoiceWeightsProps) {
  const { shippingId, download } = await searchParams;
  if (!shippingId) notFound();

  const [shipping, qualityBreakdown, shippingTotals, wrappingTypes, pallets] =
    await Promise.all([
      getShippingById(shippingId),
      getQualityBreakdownByShippingId(shippingId),
      getShippingTotalsById(shippingId),
      getWrappingTypeBreakdownByShippingId(shippingId),
      groupShippingWeightByWrappingWithPallets(shippingId),
    ]);
  const clientInfo = {
    name: `${shipping?.client?.person?.firstname ?? ""} ${
      shipping?.client?.person?.lastname ?? ""
    }`.trim(),
    shippingId: String(shippingId),
    plateNumber: shipping?.plate_number,
    date: formatDate(String(shipping?.created_at)),
  };
  return (
    <div
      className={`bg-gradient-to-br from-blue-50 via-slate-50 to-gray-50   print:bg-white  `}
    >
      {!download && (
        <Header showPackIcon={true} text="" link="/dashboard/shipping">
          <HasPermissionsServer permission="download_invoice:shipping">
            <PrintShippingInvoiceBtn
              weight={shippingTotals?.totalWeight}
              shippingId={shippingId}
            />
          </HasPermissionsServer>
        </Header>
      )}
      <div
        className={`max-w-6xl mx-auto space-y-6  min-h-screen ${
          download ? "p-0" : "py-7"
        }`}
      >
        {/* Invoice Content */}
        <Card
          className={` ${
            download
              ? "rounded-none  shadow-none"
              : "bg-white shadow-lg  rounded-2xl"
          }  `}
        >
          <CardHeader className="border-b border-gray-100 pb-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="md:text-xl xl:text-2xl font-bold text-gray-900">
                  FACTURE D&apos;EXPÉDITION
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-8">
            {!download && (
              <HasPermissionsServer permission="update:shipping">
                <Link
                  href={`/shipping/${shippingId}/update`}
                  className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium p-2  border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"
                >
                  <ArrowsUpFromLine className="w-4 h-4" />
                  Modifier Expédition
                </Link>
              </HasPermissionsServer>
            )}

            {/* Client Info */}
            <InvoiceClientInfo client={clientInfo} />

            {/* Summary Stats */}
            <InvoiceSummaryStats summary={shippingTotals} />
            {!download && (
              <HasPermissionsServer permission="update:weight_fish_shipping">
                <Link
                  href={`/shipping/${shippingId}/details`}
                  className="cursor-pointer mr-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium p-2  border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"
                >
                  <Box className="w-4 h-4" />
                  Modifier les palettes
                </Link>
              </HasPermissionsServer>
            )}
            {!download && (
              <HasPermissionsServer permission="details:weight_fish_shipping">
                <Link
                  href={`/shipping/${shippingId}/details`}
                  className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium p-2  border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"
                >
                  <Eye className="w-4 h-4" />
                  Voir les palettes
                </Link>
              </HasPermissionsServer>
            )}
            {/* Quality Breakdown */}
            <InvoiceQualityBreakdown qualityBreakdown={qualityBreakdown} />
            <div className="print-page-break mx-5" />
            {/* Fish Types Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Fish className="w-5 h-5 mr-2 text-blue-600" />
                Type d&apos;emballage
              </h3>
              <div className="flex flex-wrap gap-4">
                {wrappingTypes?.map((wrap, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-900">
                        {wrap.type}
                      </h4>
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {wrap.pallets} palettes
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Poids</p>
                        <p className="font-semibold text-gray-900">
                          {wrap.weight} kg
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Boîtes</p>
                        <p className="font-semibold text-gray-900">
                          {wrap.boxes}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pallet Details */}
            <InvoicePalletDetails pallets={pallets} />
          </CardContent>

          {/* Footer */}
          {/* <div className="border-t border-gray-100 p-6 bg-gray-50 rounded-b-2xl print:bg-white print:rounded-none">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <p>
                  Date d'impression: {new Date().toLocaleDateString("fr-FR")}
                </p>
                <p>Contact: +212 5XX-XXXXXX | contact@poissons.ma</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Signature autorisée</p>
                <div className="w-32 h-12 border-b border-gray-300 mt-4"></div>
              </div>
            </div>
          </div> */}
        </Card>
      </div>
    </div>
  );
}
