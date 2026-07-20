"use client";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import FullscreenToggleButton from "./FullscreenToggleButton";
import { UserTools } from "./UserTools";

export default function Header({
  text,
  className,
  showPackIcon,
  children,
  link,
}: {
  text: string;
  className?: string;
  showPackIcon: boolean;
  children?: React.ReactNode;
  link?: string;
}) {
  const router = useRouter();

  return (
    <header
      className={`bg-[#3354f4] w-full min-h-[60px] lg:min-h-[70px] py-2 lg:text-xl text-white font-semibold pl-4 lg:pl-16 flex items-center  ${className}`}
    >
      <div className="relative flex w-full max-w-7xl  mx-auto items-center justify-between">
        {showPackIcon && (
          <button
            className="w-[50px] h-[50px] hover:bg-[#b9b6b66d] rounded-full duration-150"
            onClick={() => {
              if (link) {
                return router.push(link);
              }
              router.back();
            }}
          >
            <ArrowLeftIcon className=" w-[36px] h-[36px]  mx-auto  cursor-pointer rounded-full" />
          </button>
        )}{" "}
        <div
          className={`flex ${
            text.length > 1 ? "justify-between" : "justify-end"
          } justify-between items-center w-full gap-2 px-3 lg:px-10`}
        >
          <p className="hidden md:block">{text}</p>{" "}
          <div className="flex items-center flex-1 justify-end gap-6">
            <FullscreenToggleButton />
            <UserTools />
            {children}
          </div>
        </div>
      </div>
    </header>
  );
}
