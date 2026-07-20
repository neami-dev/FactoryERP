import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPermission } from "@/lib/actions/permission.actions";
import { IPermissionCategory } from "@/interfaces";

interface CreatePermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: IPermissionCategory[];
}

const CreatePermissionModal = ({
  isOpen,
  onClose,
  categories,
}: CreatePermissionModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.name.trim() &&
      formData.description.trim() &&
      formData.category_id
    ) {
      const created = await createPermission({
        permission: {
          name: formData.name,
          description: formData.description,
          category_id: Number(formData.category_id),
          is_active: true,
        },
        path: "/dashboard/authorization",
      });
      if (created) {
        setFormData({ name: "", description: "", category_id: "" });
        onClose();
 
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-fit rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Créer une Nouvelle Permission
          </DialogTitle>
          <DialogDescription>
            Définissez une nouvelle permission pour le système.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">
              Nom de la Permission *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Ex: Gérer Stock"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Décrivez cette permission..."
              className="mt-1"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-sm font-medium">
              Catégorie *
            </Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category_id: value }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Créer la Permission
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePermissionModal;
