import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

interface QualityData {
  weight: number;
  boxes: number;
  description: string;
}

type QualityBreakdown = Record<string, QualityData>;

interface InvoiceQualityBreakdownProps {
  qualityBreakdown?: QualityBreakdown;
}

const InvoiceQualityBreakdown = ({
  qualityBreakdown,
}: InvoiceQualityBreakdownProps) => {
  const getQualityColor = (): string => {
    const colors = [
      "bg-red-100 text-red-800 border-red-200",
      "bg-green-100 text-green-800 border-green-200",
      "bg-blue-100 text-blue-800 border-blue-200",
      "bg-yellow-100 text-yellow-800 border-yellow-200",
      "bg-purple-100 text-purple-800 border-purple-200",
      "bg-pink-100 text-pink-800 border-pink-200",
      "bg-indigo-100 text-indigo-800 border-indigo-200",
      "bg-orange-100 text-orange-800 border-orange-200",
      "bg-teal-100 text-teal-800 border-teal-200",
    ];
    const index = Math.floor(Math.random() * colors.length);
    return colors[index];
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <Award className="w-5 h-5 mr-2 text-blue-600" />
          Les qualités
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {Object.entries(qualityBreakdown ?? {}).map(([quality, data]) => (
            <div
              key={quality}
              className="min-w-[240px] bg-gray-50 rounded-xl p-4 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-3">
                <Badge
                  variant="outline"
                  className={`text-sm font-medium ${getQualityColor()}`}
                >
                  Qualité {quality}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-gray-600">{data.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Poids</p>
                    <p className="font-semibold text-gray-900">
                      {data.weight} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Boîtes</p>
                    <p className="font-semibold text-gray-900">{data.boxes}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceQualityBreakdown;
