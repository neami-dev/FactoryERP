"use client";

import { useQuery } from "@tanstack/react-query";

import { getCategoryWeightTypeStatsWrap } from "@/lib/actions/wrappingWeightFish.actions";

export function useCategoryWeightTypeStatsWrap({
  period = "month",
  startDate,
  endDate,
}: {
  period?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  return useQuery({
    queryKey: ["categoryWeightTypeStatsWrap", period, startDate, endDate],
    queryFn: () =>
      getCategoryWeightTypeStatsWrap({ period, startDate, endDate }),
  });
}
