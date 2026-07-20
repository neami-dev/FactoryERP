import Image from "next/image";
import React from "react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Image
        src="/icons/infinite-spinner-loading.svg"
        alt="loading"
        width={100}
        height={100}
      />
    </div>
  );
}
