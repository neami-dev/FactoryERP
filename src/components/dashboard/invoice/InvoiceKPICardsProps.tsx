import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Euro, FileText, Package, TrendingUp } from "lucide-react";

export function InvoiceKPICards() {
  // Données simulées - à remplacer par de vraies données API
  const kpiData = {
    totalRevenue: 45780.5,
    totalInvoices: 142,
    totalInvoicedWeight: 12750.8,
    coverageRate: 87.3,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatWeight = (weight: number) => {
    return `${weight.toLocaleString("fr-FR")} kg`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Chiffre d&apos;Affaires Total
          </CardTitle>
          <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Euro className="h-5 w-5 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(kpiData.totalRevenue)}
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">
              +12.5% vs mois dernier
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Factures
          </CardTitle>
          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {kpiData.totalInvoices.toLocaleString("fr-FR")}
          </div>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-600">Période sélectionnée</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Poids Total Facturé
          </CardTitle>
          <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Package className="h-5 w-5 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {formatWeight(kpiData.totalInvoicedWeight)}
          </div>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-600">Toutes catégories</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Taux de Couverture
          </CardTitle>
          <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {kpiData.coverageRate}%
          </div>
          <div className="flex items-center mt-2">
            <Badge
              variant={kpiData.coverageRate >= 90 ? "default" : "secondary"}
              className={
                kpiData.coverageRate >= 90
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }
            >
              {kpiData.coverageRate >= 90 ? "Excellent" : "À améliorer"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
