import PermissionsRolesContent from "@/components/dashboard/auth/PermissionsRolesContent";
import { getAllPermissions } from "@/lib/actions/permission.actions";
import { getAllPermissionCategories } from "@/lib/actions/permissionCategory.actions";
import { getAllRoles } from "@/lib/actions/role.actions";

export default async function page() {
  const roles = await getAllRoles();
  const permissions = await getAllPermissions();
  const categories = await getAllPermissionCategories();
 

  return (
    <div className="min-h-screen bg-gradient-to-brn from-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="">
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">
            Gestion des Permissions et Rôles
          </h1>
          <p className="text-gray-600 text-sm md:text-lg">
            Configurez les rôles et permissions pour votre système de gestion
          </p>
        </div>
        <PermissionsRolesContent
          roles={roles?.data}
          permissions={permissions?.data}
          categories={categories?.data}
       
        />
      </div>
    </div>
  );
}
