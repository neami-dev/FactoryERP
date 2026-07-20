"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useUser from "@/hooks/useUser";
import { signOut } from "next-auth/react";
import Image from "next/image";


export function UserTools() {
  const { data } = useUser();
  const name = `${data?.person?.firstname || ""?.charAt(0).toUpperCase()} ${
    data?.person?.lastname || ""?.charAt(0).toUpperCase()
  }`;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer w-[50px] h-[50px] bg-white">
          <AvatarImage src="/icons/user.svg" alt="@shadcn" />
          <AvatarFallback className="text-gray-700 font-medium bg-white">
            {name}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        {/* <DropdownMenuItem className="cursor-pointer hover:bg-gray-300 duration-150">
          Profil
          <DropdownMenuShortcut>
            <User />
          </DropdownMenuShortcut>
        </DropdownMenuItem> */}
        <DropdownMenuItem
          onClick={() => signOut()}
          className="cursor-pointer hover:bg-gray-300 duration-150 hover:!text-red-500 text-red-500"
        >
          Se déconnecter
          <DropdownMenuShortcut>
            <Image src="/icons/logout.svg" priority alt="" width={20} height={20} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
