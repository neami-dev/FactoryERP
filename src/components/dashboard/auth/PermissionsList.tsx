import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key } from "lucide-react";
import { IPermission } from "@/interfaces";

interface PermissionsListProps {
  permissions?: IPermission[];
}

const PermissionsList = ({ permissions }: PermissionsListProps) => {
  const groupedPermissions = permissions?.reduce(
    (acc: Record<string, IPermission[]>, permission) => {
      const category = String(permission.category?.name ?? "Autre");
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(permission);
      return acc;
    },
    {} as Record<string, IPermission[]>
  );

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
    <Card className="bg-white shadow-lg border-0 rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
          <Key className="w-6 h-6 mr-3 text-green-600" />
          Permissions Disponibles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedPermissions ?? {}).map(
          ([category, categoryPermissions]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className={`text-sm font-medium ${getCategoryColor(
                    category
                  )}`}
                >
                  {category}
                </Badge>
                <span className="text-xs text-gray-500">
                  ({categoryPermissions.length} permissions)
                </span>
              </div>

              <div className="grid gap-3">
                {categoryPermissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {permission.name}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {permission.description}
                        </p>
                      </div>
                      <div className="ml-3">
                        <Badge
                          variant="outline"
                          className="text-xs bg-gray-50 text-gray-600 border-gray-200"
                        >
                          ID: {permission.id}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default PermissionsList;
