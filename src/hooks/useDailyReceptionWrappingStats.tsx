"use client";

import { useQuery } from "@tanstack/react-query";

import { getDailyReceptionWrappingStats } from "@/lib/actions/reception.actions";

export function useDailyReceptionWrappingStats({
  period = "week",
  startDate,
  endDate,
}: {
  period?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  return useQuery({
    queryKey: ["dailyReceptionWrappingStatsRes", period, startDate, endDate],
    queryFn: () =>
      getDailyReceptionWrappingStats({ period, startDate, endDate }),
  });
}
