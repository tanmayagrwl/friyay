// src/store/schedule-store.ts
import { create } from "zustand"
import {
  Activity,
  DaySchedule,
  TimeBlock,
  WeekendData,
  Plans,
  ScheduledActivity,
} from "../types/types" // Adjust path if needed

// This helper function is safe to keep as it's only called on the client now.
function getStartOfCurrentWeekend(): string {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0=Sun, 6=Sat
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7
  const saturday = new Date(today)
  saturday.setDate(today.getDate() + daysUntilSaturday)
  return saturday.toISOString().split("T")[0] // Format as "YYYY-MM-DD"
}

// Define the state shape
interface ScheduleState {
  plans: Plans
  activeWeekendStartDate: string | null // Allow null for initial state
  setActiveWeekend: (date: string) => void
  initializeActiveWeekend: () => void // New action for safe initialization
  getActivePlan: () => WeekendData | undefined
  addActivity: (
    activity: Activity,
    day: "saturday" | "sunday",
    timeBlock: TimeBlock
  ) => void
  removeActivity: (instanceId: string) => void // <-- ADD THIS
  reorderActivities: (
    day: "saturday" | "sunday",
    timeBlock: TimeBlock,
    oldIndex: number,
    newIndex: number
  ) => void
  moveActivityBetweenTimeBlocks: (
    instanceId: string,
    fromDay: "saturday" | "sunday",
    fromTimeBlock: TimeBlock,
    toDay: "saturday" | "sunday", 
    toTimeBlock: TimeBlock,
    toIndex: number
  ) => void
  updateActivityNote: (instanceId: string, note: string) => void // <-- ADD THIS
}

const createEmptyPlan = (startDate: string): WeekendData => ({
  startDate,
  saturday: { morning: [], afternoon: [], evening: [] },
  sunday: { morning: [], afternoon: [], evening: [] },
})

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  plans: {},
  activeWeekendStartDate: null, // Start with null to prevent hydration mismatch

  initializeActiveWeekend: () => {
    // This function will be called from a useEffect in a component
    if (get().activeWeekendStartDate === null) {
      set({ activeWeekendStartDate: getStartOfCurrentWeekend() })
    }
  },

  setActiveWeekend: (date) => set({ activeWeekendStartDate: date }),

  getActivePlan: () => {
    const { plans, activeWeekendStartDate } = get()
    if (!activeWeekendStartDate) return undefined // Handle null case
    return plans[activeWeekendStartDate]
  },

  addActivity: (activity, day, timeBlock) =>
    set((state) => {
      const { plans, activeWeekendStartDate } = state

      // Guard against adding an activity before the date is initialized
      if (!activeWeekendStartDate) return {}

      const currentPlan =
        plans[activeWeekendStartDate] || createEmptyPlan(activeWeekendStartDate)

      const newScheduledActivity: ScheduledActivity = {
        ...activity,
        instanceId: crypto.randomUUID(),
      }

      const updatedPlan = JSON.parse(JSON.stringify(currentPlan))
      updatedPlan[day][timeBlock].push(newScheduledActivity)

      return {
        plans: {
          ...plans,
          [activeWeekendStartDate]: updatedPlan,
        },
      }
    }),
  removeActivity: (instanceId) =>
    set((state) => {
      const { plans, activeWeekendStartDate } = state
      if (!activeWeekendStartDate) return {} // Guard clause

      const currentPlan = plans[activeWeekendStartDate]
      if (!currentPlan) return {} // Guard clause

      // Create a deep copy to avoid direct state mutation
      const updatedPlan = JSON.parse(JSON.stringify(currentPlan))

      // Find and remove the activity from whichever list it's in
      for (const day of ["saturday", "sunday"]) {
        for (const timeBlock of ["morning", "afternoon", "evening"]) {
          updatedPlan[day][timeBlock] = updatedPlan[day][timeBlock].filter(
            (activity: ScheduledActivity) => activity.instanceId !== instanceId
          )
        }
      }

      return {
        plans: {
          ...plans,
          [activeWeekendStartDate]: updatedPlan,
        },
      }
    }),

  reorderActivities: (day, timeBlock, oldIndex, newIndex) =>
    set((state) => {
      const { plans, activeWeekendStartDate } = state
      if (!activeWeekendStartDate) return {} // Guard clause

      const currentPlan = plans[activeWeekendStartDate]
      if (!currentPlan) return {} // Guard clause

      // Create a deep copy to avoid direct state mutation
      const updatedPlan = JSON.parse(JSON.stringify(currentPlan))
      const activities = updatedPlan[day][timeBlock]

      // Reorder the activities array
      const [movedActivity] = activities.splice(oldIndex, 1)
      activities.splice(newIndex, 0, movedActivity)

      return {
        plans: {
          ...plans,
          [activeWeekendStartDate]: updatedPlan,
        },
      }
    }),

  moveActivityBetweenTimeBlocks: (instanceId, fromDay, fromTimeBlock, toDay, toTimeBlock, toIndex) =>
    set((state) => {
      const { plans, activeWeekendStartDate } = state
      if (!activeWeekendStartDate) return {} // Guard clause

      const currentPlan = plans[activeWeekendStartDate]
      if (!currentPlan) return {} // Guard clause

      // Create a deep copy to avoid direct state mutation
      const updatedPlan = JSON.parse(JSON.stringify(currentPlan))
      
      // Find and remove the activity from the source location
      const sourceActivities = updatedPlan[fromDay][fromTimeBlock]
      const activityIndex = sourceActivities.findIndex(
        (activity: ScheduledActivity) => activity.instanceId === instanceId
      )
      
      if (activityIndex === -1) return {} // Activity not found
      
      const [movedActivity] = sourceActivities.splice(activityIndex, 1)
      
      // Add the activity to the target location at the specified index
      const targetActivities = updatedPlan[toDay][toTimeBlock]
      targetActivities.splice(toIndex, 0, movedActivity)

      return {
        plans: {
          ...plans,
          [activeWeekendStartDate]: updatedPlan,
        },
      }
    }),

      updateActivityNote: (instanceId, note) =>
    set((state) => {
      const { plans, activeWeekendStartDate } = state;
      if (!activeWeekendStartDate) return {};

      const currentPlan = plans[activeWeekendStartDate];
      if (!currentPlan) return {};

      const updatedPlan = JSON.parse(JSON.stringify(currentPlan));

      // Find the specific activity and update its note
      let activityUpdated = false;
      for (const day of ['saturday', 'sunday']) {
        for (const timeBlock of ['morning', 'afternoon', 'evening']) {
          const activities = updatedPlan[day][timeBlock] as ScheduledActivity[];
          const activityIndex = activities.findIndex(act => act.instanceId === instanceId);
          if (activityIndex > -1) {
            activities[activityIndex].note = note;
            activityUpdated = true;
            break;
          }
        }
        if(activityUpdated) break;
      }

      return {
        plans: {
          ...plans,
          [activeWeekendStartDate]: updatedPlan,
        },
      };
    }),
}));
