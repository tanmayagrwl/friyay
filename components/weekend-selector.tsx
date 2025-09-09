// src/components/weekend-selector.tsx
'use client';

import { useEffect } from 'react';
import { useScheduleStore } from "@/store/schedule-store";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function WeekendSelector() {
  const activeDate = useScheduleStore((state) => state.activeWeekendStartDate);
  const setActiveDate = useScheduleStore((state) => state.setActiveWeekend);
  const initializeActiveWeekend = useScheduleStore((state) => state.initializeActiveWeekend);

  // This useEffect hook is the core of the fix.
  // It runs only on the client, after the initial render.
  useEffect(() => {
    initializeActiveWeekend();
  }, [initializeActiveWeekend]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
    selectedDate.setDate(selectedDate.getDate() + daysUntilSaturday);

    setActiveDate(selectedDate.toISOString().split('T')[0]);
  };

  // While the date is null (during server render and initial client render),
  // show a disabled loading button.
  if (!activeDate) {
    return (
      <Button
        variant={"outline"}
        className="w-[280px] justify-start text-left font-normal text-muted-foreground"
        disabled
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        <span>Loading weekend...</span>
      </Button>
    );
  }

  // Once the date is initialized, render the fully interactive component.
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-[280px] justify-start text-left font-normal")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {`Weekend of ${format(new Date(activeDate), "PPP")}`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={new Date(activeDate)}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}