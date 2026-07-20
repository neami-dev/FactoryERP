"use client";
import { Button } from "../ui/button";
 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import InvoiceForm from "./InvoiceForm";

import { getAllCompanies } from "@/lib/actions/company.actions";
import { useEffect, useState } from "react";
import { ICompany, IInvoice } from "@/interfaces";
import Image from "next/image";
 

export default function UpdateTraceabilityInvoicePopUp({
  text,
  invoice_id,
  invoice
}: {
  text?: string;
  invoice_id: number;
  invoice:IInvoice
}) {
  const [allcompanies, setAllcompanies] = useState<ICompany[] | undefined>();

  useEffect(() => {
    getAllCompanies().then((res) => {
      setAllcompanies(res?.data);
    });
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="bg-[#3354f4]/90 hover:bg-[#3354f4] w-fit h-fit text-white hover:text-white cursor-pointer py-1 px-3 flex gap-2 items-center text-base  rounded-md"
        >
          Modifier{" "}
          <Image src={"/icons/white-edit.svg"} width={23} height={23} alt="" />
        </Button>
      </DialogTrigger>
      <DialogContent className=" w-full h-screen flex p-2 flex-col items-center justify-center  rounded-lg shadow-sm border border-blue-100 ">
        <DialogHeader>
          <DialogTitle className="text-center text-xl py-5 text-[#3354f4] font-bold md:text-3xl">
            Saisie Traçabilité
          </DialogTitle>

          <DialogDescription className="flex justify-center  items-center  gap-2 py-8 text-base font-medium text-red-500">
            {text && (
              <>
                <Image src="/icons/danger.svg" alt="" width={22} height={22} />{" "}
                {text}
              </>
            )}
          </DialogDescription>
          <InvoiceForm
            type="Update"
            invoice_id={invoice_id}
            companies={allcompanies}
            invoice={invoice}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
