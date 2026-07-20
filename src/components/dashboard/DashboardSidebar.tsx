"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  ArrowsUpFromLine,
  ChevronsUpDownIcon,
  LayoutDashboard,
  PackageCheck,
  TruckIcon,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { usePathname } from "next/navigation";
import HasPermissions from "../auth/HasPermissions";

export function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarContent className="w-64">
        <SidebarHeader className="px-3 py-[19px] text-xl w-full bg-[#3354f4] text-white flex items-center justify-center  gap-2  flex-row font-semibold">
          <LayoutDashboard /> <span>Tableau de bord</span>
        </SidebarHeader>
        <SidebarGroup className=" py-2 mt-2 ">
          <div className="flex flex-col gap-6 font-medium text-gray-500 pt-8  items-center">
            <Link
              className={`flex w-full pl-7 items-center py-2 rounded-md gap-4 hover:text-[#3354f4] ${
                pathname === "/dashboard" && "bg-[#3353f41b] text-[#3354f4]"
              }`}
              href={"/dashboard"}
            >
              <LayoutDashboard className="text-[#3354f4]" />{" "}
              <span>Tableau de bord</span>
            </Link>
            <HasPermissions
              permissions={["show:reception", "show_price:reception"]}
            >
              <SidebarMenu>
                <Collapsible className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className=" hover:text-[#3354f4] !duration-600 cursor-pointer text-base py-5 pl-5 w-full flex items-center   text-center rounded-md ">
                        <div className="w-[40px] h-[40px] flex justify-center items-center">
                          <TruckIcon className="text-[#3354f4]" />
                        </div>{" "}
                        Receptions{" "}
                        <ChevronsUpDownIcon className="h-4 w-4 ml-7" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <HasPermissions permissions={["show:reception"]}>
                        {" "}
                        <Link
                          href={`/dashboard/reception`}
                          className={`rounded-md hover:bg-[#ececee73] my-2 flex gap-3 ml-14 ${
                            pathname === "/dashboard/reception" &&
                            "bg-[#3353f41b] text-[#3354f4]"
                          }  px-4 py-2 font-mono text-base `}
                        >
                          <Image
                            src="/icons/view-list.svg"
                            alt=""
                            width={22}
                            height={20}
                          />{" "}
                          Afficher Tout
                        </Link>
                      </HasPermissions>
                      <HasPermissions permissions={["show_price:reception"]}>
                        <Link
                          href={`/dashboard/reception/add-price`}
                          className={`rounded-md hover:bg-[#ececee73] my-2 flex gap-3 ml-14 ${
                            pathname === "/dashboard/reception/add-price" &&
                            "bg-[#3353f41b] text-[#3354f4]"
                          }  px-4 py-2 font-mono text-base `}
                        >
                          <Image
                            src="/icons/add-price.svg"
                            alt=""
                            width={20}
                            height={20}
                          />{" "}
                          Ajouter le Prix
                        </Link>
                      </HasPermissions>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </HasPermissions>
            <HasPermissions
              permissions={["details:wrapping", "validate:wrapping"]}
            >
              {" "}
              <Link
                className={`rounded-md hover:bg-[#ececee73] pl-6   flex gap-4 w-full ${
                  pathname === "/dashboard/wrapping" &&
                  "bg-[#3353f41b] text-[#3354f4]"
                }  px-4 py-2 font-mono text-base `}
                href={"/dashboard/wrapping"}
              >
                <PackageCheck className="text-[#3354f4]" /> Emballage
              </Link>
            </HasPermissions>
            <HasPermissions
              permissions={["details:shipping", "validate:shipping"]}
            >
              {" "}
              <Link
                className={`rounded-md hover:bg-[#ececee73] pl-6   flex gap-4 w-full ${
                  pathname === "/dashboard/shipping" &&
                  "bg-[#3353f41b] text-[#3354f4]"
                }  px-4 py-2 font-mono text-base `}
                href={"/dashboard/shipping"}
              >
                <ArrowsUpFromLine className="text-[#3354f4]" /> Expédition
              </Link>
            </HasPermissions>
            <HasPermissions permissions={["manage:fish_category"]}>
              <Link
                className={`rounded-md hover:bg-[#ececee73] pl-6   flex gap-4 w-full ${
                  pathname === "/dashboard/fish-category" &&
                  "bg-[#3353f41b] text-[#3354f4]"
                }  px-4 py-2 font-mono text-base `}
                href={"/dashboard/fish-category"}
              >
                <Image
                  src="/icons/fish-10.svg"
                  alt="fish"
                  width={25}
                  height={25}
                />{" "}
                Poissons
              </Link>
            </HasPermissions>
            <HasPermissions permissions={["manage:quality_fish"]}>
              <Link
                className={`rounded-md hover:bg-[#ececee73] pl-6   flex gap-4 items-center w-full ${
                  pathname === "/dashboard/quality" &&
                  "bg-[#3353f41b] text-[#3354f4]"
                }  px-4 py-2 font-mono text-base `}
                href={"/dashboard/quality"}
              >
                <Image
                  src="/icons/quality.svg"
                  alt="quality"
                  width={20}
                  height={20}
                />{" "}
                Qualité
              </Link>
            </HasPermissions>{" "}
            <HasPermissions
              permissions={[
                "create:user",
                "delete:user",
                "update:user",
                "show:user",
              ]}
            >
              {" "}
              <Link
                className={`rounded-md hover:bg-[#ececee73] pl-6   flex gap-4 items-center w-full ${
                  pathname === "/dashboard/users" &&
                  "bg-[#3353f41b] text-[#3354f4]"
                }  px-4 py-2 font-mono text-base `}
                href={"/dashboard/users"}
              >
                <User className="text-[#3354f4]" />
                Users
              </Link>
            </HasPermissions>
            {/* <Link
              className="flex w-full pl-6  items-center gap-4 hover:text-[#3354f4]"
              href={"/dashboard/receptions"}
            >
              <Image
                src="/icons/supplier.png"
                alt="supplier"
                width={25}
                height={25}
              />{" "}
              Fournisseurs
            </Link> */}
            <HasPermissions
              permissions={["create:role", "delete:role", "update:role"]}
            >
              <Link
                className={`rounded-md hover:bg-[#ececee73] pl-6   flex gap-4 items-center w-full ${
                  pathname === "/dashboard/authorization" &&
                  "bg-[#3353f41b] text-[#3354f4]"
                }  px-4 py-2 font-mono text-base `}
                href={"/dashboard/authorization"}
              >
                <Image src="/icons/role.svg" alt="rol" width={25} height={25} />
                Autorisations
              </Link>
            </HasPermissions>
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
