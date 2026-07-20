"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Box, Fish, CheckCircle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPalletById, updatePallet } from "@/lib/actions/pallet.actions";
import ShippingDetailsModal from "./ShippingDetailsModal";
import { useState } from "react";
import { IShippingWeightFish } from "@/interfaces";

interface ShippingCardProps {
  data: {
    pallet_id: number;
    fishCategories: string[];
    palletNumber: string;
    numberOfBoxes: number;
    weight: number;

    isValidated: boolean;
  };
}

type SelectedItem = {
  fishCategories: string[];
  palletNumber: string;
  details?: IShippingWeightFish[];
};

export default function ShippingCard({
  data: {
    pallet_id,
    fishCategories,
    palletNumber,
    numberOfBoxes,
    weight,

    isValidated,
  },
}: ShippingCardProps) {
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onValidate = async (id: number) => {
    await updatePallet({
      data: { is_validated: true, id },
      path: `/shipping/[id]/details`,
    });
  };

  const onShowDetails = async (id: number) => {
    const palletInfo = await getPalletById(id);

    setSelectedItem({
      fishCategories: fishCategories,
      palletNumber: palletNumber,
      details: palletInfo?.shipping_weight_fish,
    });
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="w-full max-w-[340px] mx-auto bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 pt-4 px-4">
          <div className="flex items-center justify-between">
            <div>
              {fishCategories.map((category, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="bg-blue-50 text-blue-700 mx-1 border-blue-200 font-medium"
                >
                  <Fish className="w-3 h-3 mr-1" />
                  {category}
                </Badge>
              ))}
            </div>
            <Badge
              variant={isValidated ? "default" : "destructive"}
              className={cn(
                "text-xs font-medium",
                isValidated
                  ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
                  : "bg-red-100 text-red-700 border-red-200 hover:bg-red-100"
              )}
            >
              {isValidated ? "Validé" : "Non validé"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4">
          <div className="space-y-4">
            {/* Pallet and Weight Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Package className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-600">
                    Palette
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {palletNumber}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Box className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-600">
                    Poids
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900">{weight} kg</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-600">
                  Nombre de boîtes
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {numberOfBoxes}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4">
              {!isValidated && (
                <Button
                  className="w-full h-10 rounded-xl cursor-pointer bg-green-600 text-white hover:bg-green-700 transition-colors"
                  onClick={() => onValidate(pallet_id)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Valider Palette
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full h-10 rounded-xl cursor-pointer border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                onClick={() => onShowDetails(pallet_id)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Détails
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {selectedItem && (
        <ShippingDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={selectedItem}
        />
      )}
    </>
  );
}
