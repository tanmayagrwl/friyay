// src/app/page.tsx
'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { ALL_ACTIVITIES } from '@/data';
import { Activity, ScheduledActivity } from '../types/types'; // Adjust path if necessary
import { ActivityCard } from '@/components/activity-card';
import { ScheduleView } from '@/components/schedule-view';
import { ModeToggle } from '@/components/mode-toggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useScheduleStore } from '@/store/schedule-store';

export default function Home() {
  const [activeDragItem, setActiveDragItem] = useState<Activity | null>(null);
  const [activeScheduledItem, setActiveScheduledItem] = useState<ScheduledActivity | null>(null);
  const addActivity = useScheduleStore((state) => state.addActivity);
  const reorderActivities = useScheduleStore((state) => state.reorderActivities);

  // Using PointerSensor and TouchSensor with activation constraints is a best practice for dnd-kit
  // It prevents accidental drags when clicking on elements.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    // Store the activity being dragged in state
    if (event.active.data.current?.isLibraryItem) {
      setActiveDragItem(event.active.data.current.activity);
    } else if (event.active.data.current?.type === 'scheduledActivity') {
      setActiveScheduledItem(event.active.data.current.activity);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    if (!over) {
      setActiveDragItem(null);
      return;
    }

    // Handle adding new activities from library to schedule
    if (active.data.current?.isLibraryItem) {
      const activity = active.data.current.activity as Activity;
      
      // Check if dropping on a time block container
      const overId = over.id.toString();
      const [day, timeBlock] = overId.split('-');

      if (day && timeBlock && (day === 'saturday' || day === 'sunday')) {
        addActivity(activity, day, timeBlock as 'morning' | 'afternoon' | 'evening');
      }
    }
    // Handle reordering scheduled activities
    else if (active.data.current?.type === 'scheduledActivity') {
      // Find the container (time block) that contains the active item
      const activeContainer = findContainer(active.id.toString());
      const overContainer = over.id.toString().includes('-') ? over.id.toString() : findContainer(over.id.toString());
      
      if (activeContainer && overContainer && activeContainer === overContainer) {
        // Reordering within the same container
        const activePlan = useScheduleStore.getState().getActivePlan();
        if (activePlan) {
          const [day, timeBlock] = activeContainer.split('-') as ['saturday' | 'sunday', 'morning' | 'afternoon' | 'evening'];
          const activities = activePlan[day][timeBlock];
          
          const oldIndex = activities.findIndex(a => a.instanceId === active.id);
          const newIndex = activities.findIndex(a => a.instanceId === over.id);
          
          if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
            reorderActivities(day, timeBlock, oldIndex, newIndex);
          }
        }
      }
    }

    setActiveDragItem(null);
    setActiveScheduledItem(null);
  };

  // Helper function to find which container an item belongs to
  const findContainer = (id: string): string | null => {
    const activePlan = useScheduleStore.getState().getActivePlan();
    if (!activePlan) return null;

    for (const day of ['saturday', 'sunday'] as const) {
      for (const timeBlock of ['morning', 'afternoon', 'evening'] as const) {
        if (activePlan[day][timeBlock].some(activity => activity.instanceId === id)) {
          return `${day}-${timeBlock}`;
        }
      }
    }
    return null;
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <main className="container mx-auto p-4 md:p-8">
        <header className="relative text-center mb-8">
          <div className="absolute top-0 right-0">
            <ModeToggle />
          </div>
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Weekendly ✨
          </h1>
          <p className="text-muted-foreground mt-2">
            Design your perfect weekend by selecting a date and adding activities.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-2xl font-semibold mb-4">Activity Library</h2>
              <div className="flex gap-2 mb-4">
                <Input placeholder="Search activities..." />
                <Button variant="outline">
                  <PlusCircle className="h-4 w-4 mr-2" /> New
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Button variant="ghost" size="sm">All</Button>
                <Button variant="ghost" size="sm">🍔 Food</Button>
                <Button variant="ghost" size="sm">🌲 Outdoors</Button>
                <Button variant="ghost" size="sm">🧘 Relax</Button>
              </div>
             <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
  {ALL_ACTIVITIES.map((activity) => (
    <ActivityCard 
      key={activity.id} 
      activity={activity} 
      variant="library" // Be explicit about the variant
    />
  ))}
</div>

            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2">
            <ScheduleView />
          </div>
        </div>
      </main>

      {/* This renders the dragged item in a portal, fixing the visual bug */}
      <DragOverlay dropAnimation={null}>
        {activeDragItem ? (
          <div className="opacity-95 rotate-2 scale-105 shadow-2xl">
            <ActivityCard activity={activeDragItem} variant="library" />
          </div>
        ) : activeScheduledItem ? (
          <div className="opacity-95 rotate-2 scale-105 shadow-2xl">
            <ActivityCard activity={activeScheduledItem} variant="schedule" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}