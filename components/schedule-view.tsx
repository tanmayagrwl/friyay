// src/components/schedule-view.tsx
'use client';

import { useScheduleStore } from '@/store/schedule-store';
import { WeekendSelector } from './weekend-selector';
import { DaySchedule, ScheduledActivity } from '../types/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';


function ScheduledActivityCard({ activity }: { activity: ScheduledActivity }) {
  return (
    <div className="bg-background border rounded-lg p-2 text-sm mb-2">
      <p className="font-semibold">{activity.title}</p>
    </div>
  );
}

// A component to render one day's schedule
function DayColumn({ day, dayName }: { day: DaySchedule; dayName: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{dayName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2 text-muted-foreground">Morning</h3>
          <div className="bg-muted/50 p-2 rounded-md min-h-[50px]">
            {day.morning.map(act => <ScheduledActivityCard key={act.instanceId} activity={act} />)}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-muted-foreground">Afternoon</h3>
          <div className="bg-muted/50 p-2 rounded-md min-h-[50px]">
            {day.afternoon.map(act => <ScheduledActivityCard key={act.instanceId} activity={act} />)}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-muted-foreground">Evening</h3>
          <div className="bg-muted/50 p-2 rounded-md min-h-[50px]">
            {day.evening.map(act => <ScheduledActivityCard key={act.instanceId} activity={act} />)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


export function ScheduleView() {
  // Get the specific plan for the active weekend using our selector function
  const activePlan = useScheduleStore((state) => state.getActivePlan());

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Your Schedule</h2>
        <WeekendSelector />
      </div>

      {activePlan ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DayColumn day={activePlan.saturday} dayName="Saturday" />
          <DayColumn day={activePlan.sunday} dayName="Sunday" />
        </div>
      ) : (
        <div className="p-8 text-center bg-muted/40 rounded-lg">
          <p>This weekend is a blank canvas!</p>
          <p className="text-muted-foreground text-sm">Drag activities here to start planning.</p>
        </div>
      )}
    </div>
  );
}