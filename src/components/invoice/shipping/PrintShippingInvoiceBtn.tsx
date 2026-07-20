"use client";

import { IShipping } from "@/interfaces";
import { getShippingById } from "@/lib/actions/shipping.actions";
import Image from "next/image";

import { useEffect, useState } from "react";

export default function PrintShippingInvoiceBtn({
  shippingId,
  weight,
}: {
  shippingId: number;
  weight?: number;
}) {
  const [loading, setLoading] = useState(false);
  const [shipping, setshipping] = useState<IShipping>();

  const getshipping = async () => {
    const shipping = await getShippingById(shippingId);
    setshipping(shipping);
  };

  useEffect(() => {
    getshipping();
  }, []);
  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/shipping/pdf/weights/${shippingId}`, {
        method: "GET",
        credentials: "include",
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const clientName = `${shipping?.client?.person?.firstname} ${shipping?.client?.person?.lastname}`;
      a.download = `expédition-${shippingId}-${clientName}-${weight}kg.pdf`;
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
