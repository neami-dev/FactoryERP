import useUser from "@/hooks/useUser";
import { ReactNode } from "react";

type Props = {
  permissions: string[];
  children: ReactNode;
};

export default function HasPermissions({ permissions, children }: Props) {
  const currentUser = useUser();

  if (
    !currentUser?.data?.role?.permissions
      ?.map((perm) => perm.name)
      .some((perm) => permissions.includes(perm))
  )
    return null;

  return <>{children}</>;
}
