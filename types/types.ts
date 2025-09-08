export type ActivityCategory = 'Food' | 'Outdoors' | 'Relax' | 'Entertainment';
export type ActivityVibe = 'Relaxed' | 'Active' | 'Social' | 'Creative';

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  vibe: ActivityVibe;
  icon: string; 
}

export interface ScheduledActivity extends Activity {
  instanceId: string;
}

export type TimeBlock = 'morning' | 'afternoon' | 'evening';

export interface DaySchedule {
  morning: ScheduledActivity[];
  afternoon: ScheduledActivity[];
  evening: ScheduledActivity[];
}

export interface WeekendPlan {
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface WeekendData {
  startDate: string;
  saturday: DaySchedule;
  sunday: DaySchedule;
}


export interface Plans {
  [startDate: string]: WeekendData;
}
