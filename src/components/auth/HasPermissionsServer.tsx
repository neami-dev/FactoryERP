import { getUserById } from "@/lib/actions/user.actions";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

import { ReactNode } from "react";

type Props = {
  permission: string;
  children: ReactNode;
};

export default async function HasPermissionsServer({
  permission,
  children,
}: Props) {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  if (!userId) return null;

  const user = await getUserById(userId);

  const HasPermissions = user?.role?.permissions
    ?.map((perm) => perm.name)
    .includes(permission);

  if (!HasPermissions) return null;

  return <>{children}</>;
}
