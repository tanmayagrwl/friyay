// src/components/weekend-selector.tsx
'use client';

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

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    // Create a new date object to avoid mutating the original one from the calendar.
    const selectedDate = new Date(date);
    
    // Calculate the difference to the next Saturday.
    // getDay() returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday.
    const dayOfWeek = selectedDate.getDay();
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7; // This handles all cases correctly

    selectedDate.setDate(selectedDate.getDate() + daysUntilSaturday);

    setActiveDate(selectedDate.toISOString().split('T')[0]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !activeDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {activeDate ? `Weekend of ${format(new Date(activeDate), "PPP")}` : <span>Pick a weekend</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={activeDate ? new Date(activeDate) : undefined}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}