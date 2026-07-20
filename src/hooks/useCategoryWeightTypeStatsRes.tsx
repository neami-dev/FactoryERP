"use client";

import { useQuery } from "@tanstack/react-query";

import { getCategoryWeightTypeStatsRes } from "@/lib/actions/receptionWeightFish.actions";

export function useCategoryWeightTypeStatsRes({
  period = "month",
  startDate,
  endDate,
}: {
  period?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  return useQuery({
    queryKey: ["categoryWeightTypeStats", period, startDate, endDate],
    queryFn: () => getCategoryWeightTypeStatsRes({ period, startDate, endDate }),
  });
}
