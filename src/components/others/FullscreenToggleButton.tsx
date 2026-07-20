"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function FullscreenToggleButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onChange);

    return () => {
      document.removeEventListener("fullscreenchange", onChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    const el = document.documentElement;

    if (!document.fullscreenElement) {
      await el
        .requestFullscreen()
        .catch((err) => console.warn("Fullscreen error:", err));
    } else {
      await document
        .exitFullscreen()
        .catch((err) => console.warn("Exit fullscreen error:", err));
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      className=" p-2 cursor-pointer   bg-white rounded-md   transition"
    >
      {isFullscreen ? (
        <Image
          src={"/icons/quit-fullscreen.svg"}
          alt=""
          width={24}
          height={24}
        />
      ) : (
        <Image src={"/icons/fullscreen.svg"} alt="" width={24} height={24} />
      )}
    </button>
  );
}
