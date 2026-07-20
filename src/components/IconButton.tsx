"use client";
import React from "react";
import * as LucideIcons from "lucide-react";
import { useRouter } from "next/navigation";

interface IconButtonProps {
  icon: string;
  label: string;
  className?: string;
  link: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  className = "",
  link,
}) => {
  const route = useRouter();
  // Type assertion to ensure the icon exists in LucideIcons
  const IconComponent =
    icon && LucideIcons[icon as keyof typeof LucideIcons]
      ? LucideIcons[icon as keyof typeof LucideIcons]
      : LucideIcons.HelpCircle;

      
  return (
    <button
      onClick={() => route.push(link)}
      className={`flex flex-col items-center justify-center w-[150px] h-[150px] md:w-[190px] md:h-[190px]   bg-white rounded-xl shadow-sm border border-[#bac5f9] hover:bg-blue-50 transition-colors cursor-pointer ${className}`}
    >
      {/* @ts-expect-error - IconComponent is a valid React component */}
      <IconComponent className="w-12 h-12 md:h-20 md:w-20 text-[#3354f4] mb-7" />
      <span className="text-sm md:text-lg font-medium text-[#4a4c55]">
        {label}
      </span>
    </button>
  );
};

export default IconButton;
