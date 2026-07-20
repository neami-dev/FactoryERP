import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { IQuality } from "@/interfaces";
import { updateQuality } from "@/lib/actions/quality.actions";

interface EditQualityModalProps {
  isOpen: boolean;
  onClose: () => void;
  quality: IQuality | null;
}

export function EditQualityModal({
  isOpen,
  onClose,
  quality,
}: EditQualityModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    code: "",
  });

  useEffect(() => {
    if (quality) {
      setFormData({
        title: quality.title,
        code: quality.code,
      });
    }
  }, [quality]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.code.trim()) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    if (!quality) return;
    const updated = await updateQuality({
      data: {
        id: quality.id,
        title: formData.title,
        code: formData.code,
      },
      path: "/dashboard/quality",
    });

    if (!updated) {
      toast.error("Erreur lors de la mise à jour de la qualité");
      return;
    }
    toast.success("Qualité mise à jour avec succès!");
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-fit rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Modifier la Qualité
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="title"
                className="text-sm font-medium text-gray-700"
              >
                Titre de la Qualité *
              </Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="ex: Qualité Premium"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label
                htmlFor="code"
                className="text-sm font-medium text-gray-700"
              >
                Code de la Qualité *
              </Label>
              <Input
                id="code"
                type="text"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                placeholder="ex: S, A, B"
                className="mt-1 font-mono"
                maxLength={10}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Code unique pour identifier la qualité
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-[#3354f4] cursor-pointer hover:bg-[#3354f4]/90"
            >
              Mettre à jour
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
