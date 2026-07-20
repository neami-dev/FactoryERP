import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export function InvoiceComparison() {
  // Données simulées - à remplacer par de vraies données API
  const comparisonData = [
    {
      receptionId: "REC-001",
      expectedWeight: 1250.5,
      invoicedWeight: 1250.5,
      difference: 0,
      percentage: 100,
      status: "complete",
    },
    {
      receptionId: "REC-002",
      expectedWeight: 980.2,
      invoicedWeight: 875.0,
      difference: -105.2,
      percentage: 89.3,
      status: "under",
    },
    {
      receptionId: "REC-003",
      expectedWeight: 1450.8,
      invoicedWeight: 1520.3,
      difference: 69.5,
      percentage: 104.8,
      status: "over",
    },
    {
      receptionId: "REC-004",
      expectedWeight: 750.0,
      invoicedWeight: 0,
      difference: -750.0,
      percentage: 0,
      status: "missing",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Complet
          </Badge>
        );
      case "under":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Sous-facturé
          </Badge>
        );
      case "over":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Sur-facturé
          </Badge>
        );
      case "missing":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Non facturé
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatWeight = (weight: number) => {
    return `${weight.toLocaleString("fr-FR")} kg`;
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Comparaison Réceptions vs Factures
        </CardTitle>
        <p className="text-sm text-gray-600">
          Analyse des écarts entre poids réceptionnés et facturés
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {comparisonData.map((item) => (
            <div
              key={item.receptionId}
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900"></span>
                  {getStatusBadge(item.status)}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {item.percentage.toFixed(1)}%
                  </div>
                  <div
                    className={`text-sm ${
                      item.difference === 0
                        ? "text-gray-600"
                        : item.difference > 0
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.difference > 0 ? "+" : ""}
                    {formatWeight(item.difference)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Poids attendu:</span>
                  <div className="font-medium">
                    {formatWeight(item.expectedWeight)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Poids facturé:</span>
                  <div className="font-medium">
                    {formatWeight(item.invoicedWeight)}
                  </div>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      item.percentage === 100
                        ? "bg-green-500"
                        : item.percentage < 90
                        ? "bg-red-500"
                        : item.percentage < 100
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
