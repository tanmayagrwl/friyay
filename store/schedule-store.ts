import { create } from "zustand"
import {
  Activity,
  TimeBlock,
  WeekendData,
  Plans,
  ScheduledActivity,
} from "../types/types" 
import { persist, createJSONStorage } from 'zustand/middleware';

function getStartOfCurrentWeekend(): string {
  const today = new Date()
  const dayOfWeek = today.getDay() 
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7
  const saturday = new Date(today)
  saturday.setDate(today.getDate() + daysUntilSaturday)
  return saturday.toISOString().split("T")[0] 
}


interface ScheduleState {
  plans: Plans
  activeWeekendStartDate: string | null 
  setActiveWeekend: (date: string) => void
  initializeActiveWeekend: () => void 
  getActivePlan: () => WeekendData | undefined
  addActivity: (
    activity: Activity,
    day: "saturday" | "sunday",
    timeBlock: TimeBlock
  ) => void
  removeActivity: (instanceId: string) => void 
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
  updateActivityNote: (instanceId: string, note: string) => void 
}

const createEmptyPlan = (startDate: string): WeekendData => ({
  startDate,
  saturday: { morning: [], afternoon: [], evening: [] },
  sunday: { morning: [], afternoon: [], evening: [] },
})

export const useScheduleStore = create(
  persist<ScheduleState>(
    (set, get) => ({

  plans: {},
  activeWeekendStartDate: null, 

  initializeActiveWeekend: () => {
    if (get().activeWeekendStartDate === null) {
      set({ activeWeekendStartDate: getStartOfCurrentWeekend() })
    }
  },

  setActiveWeekend: (date) => set({ activeWeekendStartDate: date }),

  getActivePlan: () => {
    const { plans, activeWeekendStartDate } = get()
    if (!activeWeekendStartDate) return undefined 
    return plans[activeWeekendStartDate]
  },

  addActivity: (activity, day, timeBlock) =>
    set((state) => {
      const { plans, activeWeekendStartDate } = state

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
      if (!activeWeekendStartDate) return {} 

      const currentPlan = plans[activeWeekendStartDate]
      if (!currentPlan) return {} 

      const updatedPlan = JSON.parse(JSON.stringify(currentPlan))

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
      if (!activeWeekendStartDate) return {} 

      const currentPlan = plans[activeWeekendStartDate]
      if (!currentPlan) return {}


      const updatedPlan = JSON.parse(JSON.stringify(currentPlan))
      const activities = updatedPlan[day][timeBlock]


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
      if (!activeWeekendStartDate) return {} 

      const currentPlan = plans[activeWeekendStartDate]



      const updatedPlan = JSON.parse(JSON.stringify(currentPlan))
      

      const sourceActivities = updatedPlan[fromDay][fromTimeBlock]
      const activityIndex = sourceActivities.findIndex(
        (activity: ScheduledActivity) => activity.instanceId === instanceId
      )
      
      if (activityIndex === -1) return {} 
      
      const [movedActivity] = sourceActivities.splice(activityIndex, 1)
      
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
}), {
      name: 'friyay-storage', 
      storage: createJSONStorage(() => localStorage),
    }
  ));
