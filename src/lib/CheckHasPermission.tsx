"use client";
import { redirect, usePathname } from "next/navigation";
interface IRoute {
  path: string;
  actions: string[];
}

import useUser from "@/hooks/useUser";

const routes: IRoute[] = [
  {
    path: "/dashboard/reception",
    actions: [
      "validate:reception",
      "delete:reception",
      "validate:reception",
      "download_invoice:reception",
      "details:reception",
      "update:reception",
      "show:reception",
    ],
  },
  {
    path: "/dashboard/reception/add-price",
    actions: [
      "validate:wrapping",
      "delete:wrapping",
      "validate:wrapping",
      "download_invoice:wrapping",
      "details:wrapping",
      "update:wrapping",
      "show:wrapping",
    ],
  },
  {
    path: "/dashboard/wrapping",
    actions: [
      "validate:wrapping",
      "delete:wrapping",
      "validate:wrapping",
      "download_invoice:wrapping",
      "details:wrapping",
      "update:wrapping",
      "show:wrapping",
    ],
  },
];
export default function CheckHasPermission({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data, isLoading } = useUser();
  const publicRoute = ["/", "/login"];

  if (!publicRoute.includes(pathname)) {
    const permissionsName = data?.role?.permissions?.map((p) => p.name);
    const route = routes.find((r) => r.path === pathname);
    const hasPermission = route?.actions.some((action) =>
      permissionsName?.includes(action)
    );
    if (!hasPermission || !route) {
      redirect("/");
    }
  } else {
    return <>{children}</>;
  }

  if (isLoading) {
    console.log("loading..");
    return null;
  }

  return <>{children}</>;
}
