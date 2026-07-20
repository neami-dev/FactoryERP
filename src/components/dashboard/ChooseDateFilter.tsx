"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { format } from "date-fns";

interface Props {
  period: string;
  onChange: (value: string) => void;
  startDate?: Date;
  endDate?: Date;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
}

export default function ChooseDateFilter({
  period,
  onChange,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: Props) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [internalPeriod, setInternalPeriod] = useState(period);

  const handlePeriodChange = (value: string) => {
    setInternalPeriod(value);
    

    if (value === "custom") {
      setShowDatePicker(true);
    }
    if (value !== "custom") {
      setShowDatePicker(false);
    }
    if (value === "custom" && !startDate) {
      return;
    }
   

    onChange(value);
  };
 
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    if (internalPeriod === "custom" && startDate && endDate) {
      onChange("custom");
    }
  }, [internalPeriod, startDate, endDate, onChange]);
  return (
    <div
      className={`space-y-4 ${
        isScrolled
          ? "fixed right-4 top-6 z-50 bg-white w-fit shadow-md p-4 rounded-md"
          : ""
      }`}
    >
      {/* Select Period */}
      <Select value={internalPeriod} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-fit">
          <Calendar className="w-4 h-4 mr-2" />
          <SelectValue placeholder="Filtrer par" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Aujourd&apos;hui</SelectItem>
          <SelectItem value="week">Cette semaine</SelectItem>
          <SelectItem value="month">Ce mois</SelectItem>
          <SelectItem value="custom">Période personnalisée</SelectItem>
        </SelectContent>
      </Select>

      {/* Custom Date Picker */}
      {showDatePicker && (
        <div className="flex gap-4">
          {/* Start Date */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2 w-fit">
                {startDate ? format(startDate, "yyyy-MM-dd") : "Date début"}
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <DatePicker
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* End Date */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2 w-fit">
                {endDate ? format(endDate, "yyyy-MM-dd") : "Date fin"}
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <DatePicker
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
