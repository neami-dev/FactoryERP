import { IReception } from "@/interfaces";
import { formatDate, formatFloat } from "@/lib/utils";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Truck,
  Calendar,
  Hash,
  Fish,
  MapPin,
  Scale,
  UserCheck,
} from "lucide-react";
export default async function ReceptionInfostable({
  reception,
}: {
  reception?: IReception;
}) {
  if (!reception) return;
  const supplierName = `${reception?.supplier?.person?.firstname} ${reception?.supplier?.person?.lastname}`;
  return (
    <Card className="w-full mx-auto bg-green-50 border-green-200 rounded-xl ">
      <CardContent>
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Fish className="w-5 h-5 mr-2 text-green-600" />
          Informations de Réception
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-6 gap-x-12  md:gap-x-4 gap-y-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center"> 
              <Hash className="w-4 h-4 mr-1" />
              ID Réception
            </p>
            <p className="font-medium text-gray-900">{reception.id}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Date de Réception
            </p>
            <p className="font-medium text-gray-900">
              {formatDate(String(reception.created_at))}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 whitespace-nowrap  flex items-center">
              <Fish className="w-4 h-4 mr-1" />
              Espace
            </p>
            <p className="font-medium text-gray-900">
              {reception.fish_category?.name}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <User className="w-4 h-4 mr-1" />
              Fournisseur
            </p>
            <p className="font-medium text-gray-900">{supplierName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Origine
            </p>
            <p className="font-medium text-gray-900">{reception.origin}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <Scale className="w-4 h-4 mr-1" />
              Poids Total (Net)
            </p>
            <p className="font-medium text-gray-900">
              {formatFloat(reception.total_weight_net ?? 0)} kg
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <Scale className="w-4 h-4 mr-1" />
              Poids Traçabilité
            </p>
            <p className="font-medium text-gray-900">
              {formatFloat(reception.total_weight_trace ?? 0)} kg
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <Truck className="w-4 h-4 mr-1" />
              Plaque du Camion
            </p>
            <p className="font-medium text-gray-900">
              {reception.plate_number}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <UserCheck className="w-4 h-4 mr-1" />
              ID Peseur
            </p>
            <p className="font-medium text-gray-900">
              {reception.weigher_id}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
