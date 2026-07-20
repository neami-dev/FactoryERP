"use client";

import { useQuery } from "@tanstack/react-query";
import { getReceptionsInfos } from "../lib/actions/reception.actions";

export function useReceptionsInfos({
  period = "month",
  startDate,
  endDate,
}: {
  period?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  return useQuery({
    queryKey: ["receptionsInfos", period, startDate, endDate],
    queryFn: () => getReceptionsInfos({ period, startDate, endDate }),
  });
}
