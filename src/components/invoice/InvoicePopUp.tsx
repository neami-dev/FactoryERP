import { Button } from "../ui/button";
import { StickyNoteIcon, User } from "lucide-react";
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
import CancelRecptionInvoices from "./CancelRecptionInvoices";
import { IReception } from "@/interfaces";

export default async function InvoicePopUp({
  reception,
}: {
  reception: IReception;
}) {
  const supplierName = `${reception?.supplier?.person?.firstname} ${reception?.supplier?.person?.lastname}`;
  const allcompanies = await getAllCompanies();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className=" cursor-pointer  py-5 text-base text-black"
        >
          <StickyNoteIcon className=" text-[#3354f4]" />
          <p className="hidden md:block">Traçabilité</p>
        </Button>
      </DialogTrigger>
      <DialogContent className=" w-full h-screen flex p-2 flex-col items-center justify-center  rounded-lg shadow-sm border border-blue-100 ">
        <DialogHeader>
          <DialogTitle className="text-center text-xl py-5 text-[#3354f4] font-bold md:text-3xl">
            Saisie Traçabilité
          </DialogTitle>
          {reception?.invoices?.length === 0 && (
            <div className="flex justify-center">
              <CancelRecptionInvoices receptionId={reception.id} />
            </div>
          )}

          <DialogDescription className="flex justify-center  items-center  gap-2 py-8 text-xl font-medium text-gray-800 ">
            <User width={33} height={33} className="text-[#3354f4]" />
            <span>{supplierName}</span>
          </DialogDescription>
          <InvoiceForm
            type="Create"
            companies={allcompanies?.data}
            reception_id={reception.id}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
