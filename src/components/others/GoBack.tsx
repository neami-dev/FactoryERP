"use client";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GoBack() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="rounded-md cursor-pointer border flex items-center gap-2  px-3 py-1.5  font-medium text-gray-500 hover:bg-gray-100  duration-200  "
    >
      <ArrowLeftIcon className="w-[19px]" />
      Revenir
    </button>
  );
}
