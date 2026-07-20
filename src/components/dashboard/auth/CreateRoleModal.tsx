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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { IPermission } from "@/interfaces";
import { createRole } from "@/lib/actions/role.actions";
import { toast } from "sonner";

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  permissions?: IPermission[];
}

const CreateRoleModal = ({
  isOpen,
  onClose,
  permissions,
}: CreateRoleModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.description.trim()) {
      const created = await createRole({
        role: {
          name: formData.name,
          description: formData.description,
          is_active: true,
        },
        permissions_id: formData.permissions.map(Number),
        path: "/dashboard/authorization",
      });

      if (created) {
        setFormData({ name: "", description: "", permissions: [] });
        onClose();
        toast.success("Rôle créé avec succès!");
      } else {
        toast.error("Échec de la création du rôle. Veuillez réessayer.");
      }
    }
  };

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, String(permissionId)]
        : prev.permissions.filter((id) => id !== String(permissionId)),
    }));
  };

  const groupedPermissions = permissions?.reduce((acc, permission) => {
    if (permission.category) {
      const categoryKey = String(permission.category.name);
      if (!acc[categoryKey]) {
        acc[categoryKey] = [];
      }
      acc[categoryKey].push(permission);
    }
    return acc;
  }, {} as Record<string, IPermission[]>);

  const getCategoryColor = (category: string) => {
    const colors = {
      Dashboard: "bg-purple-50 text-purple-700 border-purple-200",
      Réceptions: "bg-green-50 text-green-700 border-green-200",
      Emballages: "bg-blue-50 text-blue-700 border-blue-200",
      Factures: "bg-orange-50 text-orange-700 border-orange-200",
      Utilisateurs: "bg-red-50 text-red-700 border-red-200",
      Rôles: "bg-indigo-50 text-indigo-700 border-indigo-200",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-50 text-gray-700 border-gray-200"
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-fit rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Créer un Nouveau Rôle
          </DialogTitle>
          <DialogDescription>
            Définissez un nouveau rôle et assignez-lui des permissions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Nom du Rôle *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Ex: Gestionnaire de Stock"
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
                placeholder="Décrivez les responsabilités de ce rôle..."
                className="mt-1"
                rows={3}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Permissions ({formData.permissions.length} sélectionnée(s))
              </Label>
            </div>

            <div className="space-y-4 max-h-64 overflow-y-auto border rounded-lg p-4">
              {Object.entries(groupedPermissions ?? {}).map(
                ([category, categoryPermissions]) => (
                  <div key={category} className="space-y-2">
                    <Badge
                      variant="outline"
                      className={`text-sm font-medium ${getCategoryColor(
                        category
                      )}`}
                    >
                      {category}
                    </Badge>

                    <div className="space-y-2 ml-4">
                      {categoryPermissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-start space-x-3"
                        >
                          <Checkbox
                            id={String(permission.id)}
                            checked={formData.permissions.includes(
                              String(permission.id)
                            )}
                            onCheckedChange={(checked) =>
                              handlePermissionChange(
                                permission.id,
                                checked as boolean
                              )
                            }
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={String(permission.id)}
                              className="text-sm font-medium cursor-pointer"
                            >
                              {permission.name}
                            </Label>
                            <p className="text-xs text-gray-600 mt-1">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Créer le Rôle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoleModal;
