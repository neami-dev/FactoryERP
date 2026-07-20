import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

import { IQuality } from "@/interfaces";
import { formatDate } from "@/lib/utils";

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
} from "../ui/alert-dialog";
import { deleteQuality } from "@/lib/actions/quality.actions";
import { toast } from "sonner";
import { EditQualityModal } from "./EditQualityModal";

interface QualityTableProps {
  searchTerm: string;
  qualities?: IQuality[];
}

export function QualityTable({ searchTerm, qualities }: QualityTableProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<IQuality | null>(null);
  const filteredQualities = qualities?.filter(
    (quality) =>
      quality.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quality.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    const deleted = await deleteQuality({ id, path: "/dashboard/quality" });
    if (deleted?.success === true) {
      toast.success(deleted.message || "Qualité supprimée avec succès.");
    } else {
      toast.error(
        deleted?.message || "Erreur lors de la suppression de la qualité."
      );
    }
  };
  const handleEdit = (quality: IQuality) => {
    setIsEditModalOpen(true);
    setSelectedQuality(quality);
  };

  return (
    <div className="rounded-md border mx-auto w-fullmax-w-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">ID</TableHead>
            <TableHead className="font-semibold">Titre</TableHead>
            <TableHead className="font-semibold">Code</TableHead>
            <TableHead className="font-semibold">Date Création</TableHead>
            <TableHead className="font-semibold w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredQualities?.map((quality) => (
            <TableRow key={quality.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{quality.id}</TableCell>
              <TableCell className="font-medium text-gray-900">
                {quality.title}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono font-bold">
                  {quality.code}
                </Badge>
              </TableCell>

              <TableCell className="text-gray-600">
                {formatDate(quality.created_at)}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(quality)}
                    className="h-8 w-8 p-0 cursor-pointer hover:bg-blue-100 text-blue-600"
                  >
                    <Edit className="h-4 w-4 mx-auto" />
                  </Button>

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
                          onClick={() => handleDelete(quality.id)}
                          className="bg-red-700 cursor-pointer hover:bg-red-800"
                        >
                          Continuer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <EditQualityModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedQuality(null);
        }}
        quality={selectedQuality}
      />
    </div>
  );
}
