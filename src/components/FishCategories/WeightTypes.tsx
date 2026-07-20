"use client";

import { IWeightType } from "@/interfaces";
import Image from "next/image";
import { useEffect, useState } from "react";
import WeightTypePopUp from "./WeightTypePopUp";
import { getCategoryById } from "@/lib/actions/fishCategory.actions";
import { updateWeightTypeOrder } from "@/lib/actions/weightTypes.actions";

export default function WeightTypes({
  weight_type,
  fishCategoryId,
}: {
  weight_type: IWeightType[];
  fishCategoryId: number;
}) {
  const [showPopUp, setShowPopUp] = useState(false);
  const [formType, setFormtype] = useState<"Create" | "Update">("Create");
  const [weightType, setWeightType] = useState<IWeightType>();

  const [items, setItems] = useState<IWeightType[]>(weight_type);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  useEffect(() => {
    if (!showPopUp) {
      getCategoryById(fishCategoryId).then((newData) => {
        if (newData?.data?.weight_type) {
          setItems(newData?.data?.weight_type);
        }
      });
    }
  }, [showPopUp, fishCategoryId]);

  const handleDrop = async (index: number) => {
    if (draggedItemIndex === null) return;

    const updatedItems = [...items];
    const [removed] = updatedItems.splice(draggedItemIndex, 1);
    updatedItems.splice(index, 0, removed);

    setItems(updatedItems);
    setDraggedItemIndex(null);

    const orderUpdatePayload = updatedItems.map((item, idx) => ({
      id: item.id,
      order: idx + 1,
    }));
    await updateWeightTypeOrder(orderUpdatePayload);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="flex flex-col justify-between items-center gap-4 mt-10 relative p-4 max-w-[600px] pl-8">
        <div>
          <h3 className="text-xl font-medium py-3 mb-4 block text-[#3354f4]">
            Taille du poisson à la réception
          </h3>
          <ul className="flex flex-wrap gap-3">
            {items.map((type, index) => (
              <li
                onClick={() => {
                  setShowPopUp(true);
                  setFormtype("Update");
                  setWeightType(type);
                }}
                key={type.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(index)}
                className="text-gray-700 text-xl font-semibold border border-[#bac5f9] p-2 rounded-md w-[100px] text-center cursor-move bg-white"
              >
                {type.name}
              </li>
            ))}

            <li
              onClick={() => {
                setShowPopUp(true);
                setFormtype("Create");
              }}
              className="text-gray-700 text-xl font-semibold cursor-pointer border border-[#3354f4] py-2.5 rounded-md w-[100px] text-center"
            >
              <Image
                src={"/icons/add-blue.svg"}
                width={25}
                height={25}
                alt="Add"
                className="object-contain mx-auto"
              />
            </li>
          </ul>
        </div>
      </div>

      {showPopUp && (
        <WeightTypePopUp
          type={formType}
          weightTypeId={weightType?.id}
          handleClick={setShowPopUp}
          weightType={weightType}
          fishCategoryId={fishCategoryId}
        />
      )}
    </div>
  );
}
