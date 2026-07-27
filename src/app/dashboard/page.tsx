"use client";
// import ChartsSection from "@/components/dashboard/ChartsSection";
// import ChooseDateFilter from "@/components/dashboard/ChooseDateFilter";
// import KPICards from "@/components/dashboard/KPICards";

import ChartsSection2 from "@/components/dashboard/ChartSection2";
// import KPICards from "@/components/dashboard/KPICards";

 
import GoBack from "@/components/others/GoBack";
import { useState } from "react";

export interface dashboardComponentsProps {
  period?: string;
  startDate?: Date;
  endDate?: Date;
}
export default function Page() {
  const [period, setPeriod] = useState("month");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  return (
    <div className="space-y-8 p-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <GoBack />
        {/* <ChooseDateFilter
          period={period}
          onChange={setPeriod}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}                
          setEndDate={setEndDate}
        /> */}
      </div>
      {/* <KPICards period={period} startDate={startDate} endDate={endDate} /> */}

      {/* Charts Section */}
      <ChartsSection2 period={period} startDate={startDate} endDate={endDate} />
    </div>
  );
}