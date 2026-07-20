import Quality from "@/components/dashboard/Quality";
import { getAllQualities } from "@/lib/actions/quality.actions";
import React from "react";

export default async function page() {
  const qualities = await getAllQualities()
  return (
    <div className="p-0 md:p-8">
      <Quality qualities={qualities} />
    </div>
  );
}
