 
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

// Mock permissions data
const availablePermissions = [
  {
    id: "users",
    label: "Gérer les utilisateurs",
    description: "Créer, éditer et supprimer des utilisateurs",
  },
  {
    id: "dashboard",
    label: "Voir le tableau de bord",
    description: "Accès aux statistiques et aux graphiques",
  },
  {
    id: "reports",
    label: "Créer des rapports",
    description: "Générer et exporter des rapports",
  },
  {
    id: "settings",
    label: "Gérer les paramètres",
    description: "Modifier les paramètres système",
  },
  {
    id: "roles",
    label: "Gérer les rôles",
    description: "Créer et modifier des rôles et permissions",
  },
  {
    id: "audit",
    label: "Journal d'audit",
    description: "Consulter l'historique des actions",
  },
  {
    id: "notifications",
    label: "Envoyer des notifications",
    description: "Envoyer des messages aux utilisateurs",
  },
];

type RolePermissionsFormData = {
  roleName: string;
  roleDescription: string;
  permissions: string[];
};

interface RolePermissionsFormProps {
  initialData?: Partial<RolePermissionsFormData>;
  onSubmit?: (data: RolePermissionsFormData) => void;
  onCancel?: () => void;
}

const RolePermissionsForm = ({ 
  initialData, 
  onSubmit, 
  onCancel 
}: RolePermissionsFormProps) => {
  const defaultValues: RolePermissionsFormData = {
    roleName: initialData?.roleName || "",
    roleDescription: initialData?.roleDescription || "",
    permissions: initialData?.permissions || [],
  };

  const form = useForm<RolePermissionsFormData>({
    defaultValues,
  });

  const handleSubmit = (data: RolePermissionsFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Permissions du rôle</CardTitle>
        <CardDescription>
          Sélectionnez les permissions à accorder à ce rôle
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <CardContent>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="permissions"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availablePermissions.map((permission) => (
                        <FormField
                          key={permission.id}
                          control={form.control}
                          name="permissions"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={permission.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(permission.id)}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];
                                      
                                      if (checked) {
                                        field.onChange([...currentValues, permission.id]);
                                      } else {
                                        field.onChange(
                                          currentValues.filter((value) => value !== permission.id)
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-medium">
                                    {permission.label}
                                  </FormLabel>
                                  <p className="text-sm text-muted-foreground">
                                    {permission.description}
                                  </p>
                                </div>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-[#3354f4] hover:bg-[#3354f4]/90"
            >
              Enregistrer les permissions
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default RolePermissionsForm;
