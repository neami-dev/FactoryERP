import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Fish, Edit, Trash2 } from "lucide-react";
import { cn, getRandomColor } from "@/lib/utils";
import { IShippingWeightFish } from "@/interfaces";
import { deleteShippingWeightFish } from "@/lib/actions/shippingWeightFish.actions";
import { useState } from "react";
import Link from "next/link";
import HasPermissions from "../auth/HasPermissions";

interface ShippingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: {
    fishCategories: string[];
    palletNumber?: string;
    details?: IShippingWeightFish[];
  };
}

const ShippingDetailsModal = ({
  isOpen,
  onClose,
  data,
}: ShippingDetailsModalProps) => {
   
  const [details, setDetails] = useState<IShippingWeightFish[] | undefined>(
    data?.details
  );

  const handleDelete = async (id: number) => {
    await deleteShippingWeightFish({ id, path: "/shipping/[id]/details" });

    // Remove from local state
    setDetails((prev) => prev?.filter((item) => item.id !== id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-fit rounded-2xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center space-x-2 text-xl font-semibold">
            <Fish className="w-5 h-5 text-blue-600" />
            <span>Détails de la Palette {data?.palletNumber}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            {data?.fishCategories?.map((category, i) => (
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

          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">
                    Poids (kg)
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Nombre de boîtes
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Taille
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Type de boîte
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Type d&apos;emballage
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Espace
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Qualité
                  </TableHead>
                  <HasPermissions
                    permissions={[
                      "delete:weight_fish_shipping",
                      "update:weight_fish_shipping",
                    ]}
                  >
                    <TableHead className="font-semibold text-gray-700">
                      Actions
                    </TableHead>
                  </HasPermissions>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details?.map((record, index) => (
                  <TableRow key={index} className="hover:bg-gray-50/50">
                    <TableCell className="font-semibold text-gray-900">
                      {record.weight} kg
                    </TableCell>
                    <TableCell className="font-semibold text-gray-900">
                      {record.box}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-900">
                      {record.wrapping_weight_type?.name}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-900">
                      {record.box_type}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-900">
                      {record.wrapping_type}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-900">
                      {record.shipping_Fish_category?.fish_category?.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("font-medium", getRandomColor())}
                      >
                        {record.quality?.code}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <HasPermissions
                          permissions={["update:weight_fish_shipping"]}
                        >
                          {" "}
                          <Link
                            href={`/shipping-weight-fish/${record.id}/update`}
                           
                            className="h-8 w-8 pt-2 cursor-pointer rounded-md block hover:bg-blue-100 text-blue-600"
                          >
                            <Edit className="h-4 w-4 mx-auto" />
                          </Link>
                        </HasPermissions>
                        <HasPermissions
                          permissions={["delete:weight_fish_shipping"]}
                        >
                          {" "}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 cursor-pointer hover:bg-red-100 text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl">
                                  Êtes-vous absolument sûr ?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-lg font-semibold">
                                  Cette action ne peut pas être annulée.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="cursor-pointer">
                                  Annuler
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-700 cursor-pointer hover:bg-red-800"
                                  onClick={() => handleDelete(record.id)}
                                >
                                  Continuer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </HasPermissions>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShippingDetailsModal;
