import { useState } from "react";
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
import { createQuality } from "@/lib/actions/quality.actions";

interface CreateQualityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateQualityModal({
  isOpen,
  onClose,
}: CreateQualityModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    code: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.code.trim()) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }
    const created = await createQuality({
      data: {
        title: formData.title.trim(),
        code: formData.code.trim().toUpperCase(),
      },
      path: "/dashboard/quality",
    });

    if (created) {
      toast.success("Qualité créée avec succès!");
    }
    // Reset form and close modal
    setFormData({ title: "", code: "" });
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
            Créer une Nouvelle Qualité
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
                placeholder="ex: Qualité"
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
                onChange={(e) =>
                  handleInputChange("code", e.target.value)
                }
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
              className="cursor-pointer"
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-[#3354f4] hover:bg-[#2c4bb2] cursor-pointer"
            >
              Créer la Qualité
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
