import { Card, CardContent } from "@/components/ui/card";
import { User, Truck, Calendar, Hash } from "lucide-react";

interface ClientInfo {
  name?: string;
  shippingId?: string;
  plateNumber?: string;
  date?: string;
}

interface InvoiceClientInfoProps {
  client: ClientInfo;
}

const InvoiceClientInfo = ({ client }: InvoiceClientInfoProps) => {
  return (
    <Card className="bg-blue-50 border-blue-200 rounded-xl">
      <CardContent className="px-6 py-2">
        <h3 className="md:text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Informations Client
        </h3>
        <div className="flex justify-evenly  items-center flex-wrap gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <User className="w-4 h-4 mr-1" />
              Nom du Client
            </p>
            <p className="font-semibold text-gray-900 pl-2">{client?.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <Hash className="w-4 h-4 mr-1" />
              ID Expédition
            </p>
            <p className="font-semibold text-gray-900 pl-2">{client?.shippingId}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <Truck className="w-4 h-4 mr-1" />
              Plaque du Véhicule
            </p>
            <p className="font-semibold text-gray-900 pl-2">{client?.plateNumber}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Date d&apos;Expédition
            </p>
            <p className="font-semibold text-gray-900 pl-2">{client?.date}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceClientInfo;
