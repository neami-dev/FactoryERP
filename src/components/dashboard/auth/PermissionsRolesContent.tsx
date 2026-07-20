"use client";
import React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, Plus, Shield } from "lucide-react";
import { IPermission, IPermissionCategory, IRole } from "@/interfaces";
import RolesList from "./RolesList";
import PermissionsList from "./PermissionsList";
import CreateRoleModal from "./CreateRoleModal";

import EditRoleModal from "./EditRoleModal";
import HasPermissions from "@/components/auth/HasPermissions";
type Props = {
  roles?: IRole[];
  permissions?: IPermission[];
  categories?: IPermissionCategory[];
};
export default function PermissionsRolesContent({ roles, permissions }: Props) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<IRole | null>(null);

  const handleEditRole = (role: IRole) => {
    setEditingRole(role);
    setIsEditRoleModalOpen(true);
  };

  return (
    <div>
      {/* Action Buttons */}
      <HasPermissions permissions={["create:role"]}>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer px-6 py-3 mb-3 rounded-lg font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Créer un Rôle
        </Button>
      </HasPermissions>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white shadow-lg border-0 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
              <Shield className="w-6 h-6 mr-3 text-blue-600" />
              Total des Rôles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {roles?.length}
            </div>
            <p className="text-gray-500 text-sm mt-1">Rôles configurés</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-0 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
              <Key className="w-6 h-6 mr-3 text-green-600" />
              Total des Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {permissions?.length}
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Permissions disponibles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Roles Section */}
        <RolesList roles={roles} onEditRole={handleEditRole} />

        {/* Permissions Section */}
        <PermissionsList permissions={permissions} />
      </div>

      {/* Modals */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        permissions={permissions}
      />
      <EditRoleModal
        isOpen={isEditRoleModalOpen}
        onClose={() => {
          setIsEditRoleModalOpen(false);
          setEditingRole(null);
        }}
        permissions={permissions}
        role={editingRole}
      />
    </div>
  );
}
