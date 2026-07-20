"use client";

import { IReception } from "@/interfaces";
import { getReceptionById } from "@/lib/actions/reception.actions";
import { cn } from "@/lib/utils";
import Image from "next/image";

import { useEffect, useState } from "react";

export default function PrintRecptionInvoiveBtn({
  receptionId,
  className,
}: {
  receptionId: number;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [reception, setReception] = useState<IReception>();

  const getReception = async () => {
    const reception = await getReceptionById(receptionId);
    setReception(reception);
  };

  useEffect(() => {
    getReception();
  }, []);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reception/pdf/weights/${receptionId}`, {
        method: "GET",
        credentials: "include",
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const supplierName = `${reception?.supplier?.person?.firstname} ${reception?.supplier?.person?.lastname}`;
      a.download = `reception-${receptionId}-${reception?.fish_category?.name}-${supplierName}-${reception?.total_weight_net}-Kg.pdf`;
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
        className={cn(
          className,
          "text-blue-600 hover:text-blue-700 bg-white cursor-pointer px-4 py-2 rounded-lg flex items-center gap-2"
        )}
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
