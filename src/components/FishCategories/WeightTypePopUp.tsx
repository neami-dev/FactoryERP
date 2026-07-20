"use client";
import { XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { weightTypeSchema } from "@/lib/validator";
import {
  createWeightType,
  deleteWeighttype,
  isWeightFishUsed,
  updateWeightType,
  weightTpeExists,
} from "@/lib/actions/weightTypes.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { IWeightType } from "@/interfaces";
import { toast } from "sonner";
interface FormEvent {
  preventDefault: () => void;
}

export default function WeightTypePopUp({
  handleClick,
  fishCategoryId,
  weightTypeId,
  weightType,
  type,
}: {
  handleClick: (open: boolean) => void;
  fishCategoryId: number;
  type: "Create" | "Update";
  weightTypeId?: number;
  weightType?: IWeightType;
}) {
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [formData, setFormData] = useState({ name: "" });
  const [isUsed, setIsUsed] = useState(false);
  // @typescript-eslint/no-unused-vars
  useEffect(() => {
    if (weightTypeId) {
      isWeightFishUsed(weightTypeId).then((res) => {
        setIsUsed(res);
      });
    }
    if (type === "Update" && weightType?.name) {
      setFormData({ name: weightType?.name });
    }
  }, [type, weightType?.name, weightTypeId]);
  const handleDelete = async () => {
    if (weightTypeId) {
    const deleted = await deleteWeighttype(weightTypeId);
      handleClick(false);
      setFormData({ name: "" });
      if (deleted?.success) {
        toast.success("Suppression effectuée avec succès.");
      } else {
        toast.error("Échec de la suppression. Veuillez réessayer.");
      }
    }
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    const onCreate = weightTypeSchema.safeParse(formData);
    const onUpdate = weightTypeSchema.partial().safeParse(formData);

    if (onCreate.success) {
      const exists = await weightTpeExists({
        name: onCreate.data?.name,
        categroyId: fishCategoryId,
      });
      if (exists) {
        setErrors({ name: "Ce nom de catégorie existe déjà." });
        return;
      }
    }

    if (type === "Create") {
      if (!onCreate.success) {
        const formattedErrors: { [key: string]: string } = {};
        onCreate.error.errors.forEach((err) => {
          formattedErrors[err.path[0]] = err.message;
        });
        setErrors(formattedErrors);
        return;
      }

      const response = await createWeightType({
        weighType: { name: formData.name },
        fish_category_id: fishCategoryId,
        path: `dashboard/fish-category/${fishCategoryId}`,
      });
      if (response) {
        handleClick(false);
        setFormData({ name: "" });
        toast.success("Créer avec succès");
      }
    }
    if (type === "Update" && weightTypeId) {
      if (!onUpdate.success) {
        const formattedErrors: { [key: string]: string } = {};
        onUpdate.error.errors.forEach((err) => {
          formattedErrors[err.path[0]] = err.message;
        });
        setErrors(formattedErrors);
        return;
      }

      const response = await updateWeightType({
        weighType: { name: formData.name, id: weightTypeId },

        path: `dashboard/fish-category/${fishCategoryId}`,
      });
      if (response) {
        handleClick(false);
        setFormData({ name: "" });
        toast.success("Modifié avec succès");
      }
    }
  }
  return (
    <div className="w-[500px] h-[400px] absolute top-[130px] flex justify-center gap-8 flex-col item-center shadow-lg z-20 mx-auto rounded-md border bg-gray-50">
      <div className="relative">
        <XIcon
          onClick={() => handleClick(false)}
          className=" border-2 border-red-400 text-red-500 cursor-pointer  rounded-md absolute right-5 top-[-55px]"
        />

        {type === "Update" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                disabled={isUsed}
                className={`absolute right-20 cursor-pointer top-[-55px] ${
                  isUsed ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }
                `}
              >
                <Image
                  src="/icons/delete.svg"
                  alt="numbers"
                  width={24}
                  height={24}
                />{" "}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl">
                  Êtes-vous absolument sûr ?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-lg font-semibold">
                  Cette action ne peut pas être annulée.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Annuler
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-700 cursor-pointer hover:bg-red-800"
                  onClick={handleDelete}
                >
                  Continuer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <h2 className="text-xl text-[#3354f4] font-semibold text-center py-4">
          {type === "Create" ? "Ajouter" : "Modifier"} la Taille
        </h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex justify-center flex-col items-center gap-7"
      >
        <div>
          <Label className="p-1 text-lg flex gap-3 capitalize  text-gray-700">
            {" "}
            <div className="relative w-[24px] h-[24px]  md:w-[30px] md:h-[30px]">
              {" "}
              <Image
                src="/icons/fish-10.svg"
                alt="numbers"
                fill
                className="object-contain text-[#3354f4]"
              />
            </div>
            Nom
          </Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-[270px] py-5 !text-base font-medium"
            type="text"
          />
          <span className="text-sm pl-2 text-red-500 ">{errors.name}</span>
        </div>
        <Button
          type="submit"
          className="button col-span-2 text-base  w-fit mx-auto bg-[#3354f4] cursor-pointer hover:bg-blue-700"
        >
          {type === "Update" ? `Modifier La Taille` : "Créer la Taille"}
        </Button>
      </form>
    </div>
  );
}
