"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Edit, Trash2 } from "lucide-react";
import { IRole } from "@/interfaces";
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
} from "@/components/ui/alert-dialog";
import { deleteRole } from "@/lib/actions/role.actions";
import { toast } from "sonner";
import HasPermissions from "@/components/auth/HasPermissions";
interface RolesListProps {
  roles?: IRole[];
  onEditRole: (role: IRole) => void;
}

const RolesList = ({ roles, onEditRole }: RolesListProps) => {
  const handleDelete = async (id: number) => {
    const deleted = await deleteRole(id, "/dashboard/authorization");
    if (deleted) {
      toast.success("Rôle supprimé avec succès!");
    } else {
      toast.error("Échec de la suppression du rôle. Veuillez réessayer.");
    }
  };

  return (
    <Card className="bg-white shadow-lg border-0 rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
          <Shield className="w-6 h-6 mr-3 text-blue-600" />
          Liste des Rôles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {roles?.map((role) => (
          <div
            key={role.id}
            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {role.name}
                </h3>
                <p className="text-gray-600 text-sm">{role.description}</p>
              </div>
              <div className="flex items-center cursor-pointer space-x-2">
                <HasPermissions permissions={["update:role"]}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditRole(role)}
                    className="h-8 w-8 p-0 cursor-pointer hover:bg-blue-100 text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </HasPermissions>
                <HasPermissions permissions={["delete:role"]}>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-red-100 cursor-pointer text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Êtes-vous absolument sûr ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible. Elle supprimera
                          définitivement le compte et les données des serveurs.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">
                          Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(role.id)}
                          className="bg-red-700 hover:bg-red-800 cursor-pointer"
                        >
                          Continuer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </HasPermissions>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center text-sm text-gray-500">
                <Users className="w-4 h-4 mr-1" />
                20 utilisateur(s)
              </div>
              <div className="text-sm text-gray-500">
                Créé le {formatDate(role.created_at.toString())}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Permissions ({role.permissions && role.permissions.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {role?.permissions?.slice(0, 3).map((permission, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {permission.name}
                  </Badge>
                ))}
                {role.permissions && role.permissions.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-gray-50 text-gray-600 border-gray-200"
                  >
                    +{role.permissions.length - 3} autres
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RolesList;
