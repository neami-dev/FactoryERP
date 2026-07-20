
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const recentReceptions = [
  {
    id: "R001",
    origin: "Mer du Nord",
    plateNumber: "ABC-123",
    netWeight: "2,5 tonnes",
    status: "terminé",
    time: "il y a 2 heures",
  },
  {
    id: "R002",
    origin: "Océan Atlantique",
    plateNumber: "XYZ-456",
    netWeight: "1,8 tonnes",
    status: "en cours",
    time: "il y a 4 heures",
  },
  {
    id: "R003",
    origin: "Mer Baltique",
    plateNumber: "DEF-789",
    netWeight: "3,2 tonnes",
    status: "en attente",
    time: "il y a 6 heures",
  },
];

const recentWrappings = [
  {
    id: "E001",
    clientName: "Ocean Fresh Ltd",
    totalWeight: "1,2 tonnes",
    validationStatus: "validé",
    time: "il y a 1 heure",
  },
  {
    id: "E002",
    clientName: "Marine Delights",
    totalWeight: "0,8 tonnes",
    validationStatus: "en attente",
    time: "il y a 3 heures",
  },
  {
    id: "E003",
    clientName: "Blue Ocean Co",
    totalWeight: "2,1 tonnes",
    validationStatus: "validé",
    time: "il y a 5 heures",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "terminé":
    case "validé":
      return "bg-green-100 text-green-800 border-green-200";
    case "en cours":
    case "en attente":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function RecentActivity() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Recent Receptions */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Dernières Réceptions
            </CardTitle>
            <p className="text-sm text-gray-500">Réceptions récentes de poisson</p>
          </div>
          <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary hover:text-white">
            Voir tout
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReceptions.map((reception, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {reception.id}
                    </span>
                    <Badge className={getStatusColor(reception.status)}>
                      {reception.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Origine :</span> {reception.origin}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Plaque :</span> {reception.plateNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Poids :</span> {reception.netWeight}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{reception.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Wrappings */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Derniers Emballages
            </CardTitle>
            <p className="text-sm text-gray-500">Emballages récents de poisson</p>
          </div>
          <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary hover:text-white">
            Voir tout
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentWrappings.map((wrapping, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {wrapping.id}
                    </span>
                    <Badge className={getStatusColor(wrapping.validationStatus)}>
                      {wrapping.validationStatus}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Client :</span> {wrapping.clientName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Poids :</span> {wrapping.totalWeight}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{wrapping.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
