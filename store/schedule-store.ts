// src/store/schedule-store.ts
import { create } from 'zustand';
import { Activity, DaySchedule, TimeBlock, WeekendData, Plans, ScheduledActivity } from '../types/types';

// Helper to get the start of the current weekend (Saturday)
function getStartOfCurrentWeekend(): string {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const diff = 6 - dayOfWeek; // Days to add to get to Saturday
  const saturday = new Date(today.setDate(today.getDate() + diff));
  return saturday.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
}

// Define the state shape
interface ScheduleState {
  plans: Plans;
  activeWeekendStartDate: string;
  setActiveWeekend: (date: string) => void;
  getActivePlan: () => WeekendData | undefined;
  addActivity: (activity: Activity, day: 'saturday' | 'sunday', timeBlock: TimeBlock) => void;
  // We will add removeActivity, moveActivity etc. here later
}

// Define the initial empty state for a single plan
const createEmptyPlan = (startDate: string): WeekendData => ({
  startDate,
  saturday: { morning: [], afternoon: [], evening: [] },
  sunday: { morning: [], afternoon: [], evening: [] },
});

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  plans: {},
  activeWeekendStartDate: getStartOfCurrentWeekend(),

  setActiveWeekend: (date) => set({ activeWeekendStartDate: date }),

  // A "selector" helper to get the currently active plan
  getActivePlan: () => {
    const { plans, activeWeekendStartDate } = get();
    return plans[activeWeekendStartDate];
  },

  addActivity: (activity, day, timeBlock) =>
    set((state) => {
      const { plans, activeWeekendStartDate } = state;
      
      // Get the current plan, or create it if it doesn't exist
      const currentPlan = plans[activeWeekendStartDate] || createEmptyPlan(activeWeekendStartDate);

      const newScheduledActivity: ScheduledActivity = {
        ...activity,
        instanceId: crypto.randomUUID(),
      };

      // Deep copy to avoid mutation issues
      const updatedPlan = JSON.parse(JSON.stringify(currentPlan));
      updatedPlan[day][timeBlock].push(newScheduledActivity);

      return {
        plans: {
          ...plans,
          [activeWeekendStartDate]: updatedPlan,
        },
      };
    }),
}));