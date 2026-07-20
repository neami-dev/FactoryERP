"use client";

import { useQuery } from "@tanstack/react-query";

import { getFishCategoryWeights } from "@/lib/actions/fishCategory.actions";

export function useCategoriesInfos({
  period = "month",
  startDate,
  endDate,
}: {
  period?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  return useQuery({
    queryKey: ["categoriesInfos", period, startDate, endDate],
    queryFn: () => getFishCategoryWeights({ period, startDate, endDate }),
  });
}
