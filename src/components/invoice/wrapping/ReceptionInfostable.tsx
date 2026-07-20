import { IWrapping } from "@/interfaces";
import { formatDate, formatFloat } from "@/lib/utils";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Calendar,
  Hash,
  Fish,
  Scale,
  UserCheck,
} from "lucide-react";
export default async function WrappingInfostable({
  wrapping,
}: {
  wrapping?: IWrapping;
}) {
  if (!wrapping) return;
  const clientName = `${wrapping?.client?.person?.firstname} ${wrapping?.client?.person?.lastname}`;
  return (
    <> 
    <Card className="w-fit sm:w-full mx-auto bg-green-50 border-green-200 rounded-xl ">
      <CardContent>
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Fish className="w-5 h-5 mr-2 text-green-600" />
          Informations d&apos;emballage
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 xl:grid-cols-7   gap-x-6 gap-y-4"> 
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center"> 
              <Hash className="w-4 h-4 mr-1" />
              ID Emballage
            </p>
            <p className="font-medium text-gray-900">{wrapping.id}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center"> 
              <Calendar className="w-4 h-4 mr-1" />
              Date d&apos;emballage
            </p>
            <p className="font-medium text-gray-900">
              {formatDate(String(wrapping.created_at))}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <Fish className="w-4 h-4 mr-1" />
              Espace 
            </p>
            <p className="font-medium text-gray-900">
              {wrapping.fish_category?.name}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <User className="w-4 h-4 mr-1" />
              Clinet
            </p>
            <p className="font-medium text-gray-900">{clientName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <Scale className="w-4 h-4 mr-1" />
              total espace
            </p>
            <p className="font-medium text-gray-900">
              {formatFloat(wrapping.total_weight ?? 0)}  kg
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <Scale className="w-4 h-4 mr-1" />
              total réceptions
            </p>
            <p className="font-medium text-gray-900">
              {formatFloat(wrapping.total_weight_receptions ?? 0)} kg
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <UserCheck className="w-4 h-4 mr-1" />
              ID Peseur
            </p>
            <p className="font-medium text-gray-900">
              {wrapping.weigher_id}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
    </>
   
  );
}
