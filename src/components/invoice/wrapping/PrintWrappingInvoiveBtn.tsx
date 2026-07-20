"use client";

import { IWrapping } from "@/interfaces";
import { getWrappingById } from "@/lib/actions/wrapping.actions";
import Image from "next/image";

import { useEffect, useState } from "react";

export default function PrintWrappingInvoiveBtn({
  wrappingId,
  weight,
}: {
  wrappingId: number;
  weight: number;
}) {
  const [loading, setLoading] = useState(false);
  const [wrapping, setWrapping] = useState<IWrapping>();

  const getWrapping = async () => {
    const reception = await getWrappingById(wrappingId);
    setWrapping(reception);
  };

  useEffect(() => {
    getWrapping();
  }, []);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/wrapping/pdf/weights/${wrappingId}`, {
        method: "GET",
        credentials: "include",
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const clientName = `${wrapping?.client?.person?.firstname}-${wrapping?.client?.person?.lastname}`;
      a.download = `emballage-${wrappingId}-${wrapping?.fish_category?.name}-${clientName}-${weight}-Kg.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section>
      <button
        onClick={handleDownload}
        className="text-blue-600 hover:text-blue-700 bg-white cursor-pointer px-4 py-2 rounded-lg flex items-center gap-2"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
            En cours...
          </>
        ) : (
          <>
            <Image src="/icons/download.svg" alt="" width={25} height={25} />{" "}
            <span className="hidden md:block">Télécharger PDF</span>
          </>
        )}
      </button>
    </section>
  );
}
