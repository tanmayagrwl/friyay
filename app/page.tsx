// src/app/page.tsx
'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { Activity, ScheduledActivity } from '../types/types'; // Adjust path if needed
import { ActivityCard } from '@/components/activity-card';
import { ScheduleView } from '@/components/schedule-view';
import { ModeToggle } from '@/components/mode-toggle';
import { useScheduleStore } from '@/store/schedule-store';
import { ActivityLibrary } from '@/components/activity-library';

type DragData = {
  isLibraryItem: boolean;
  activity: Activity | ScheduledActivity;
  sortable?: {
    containerId: string;
    index: number;
  };
};

export default function Home() {
  const [activeDragItem, setActiveDragItem] = useState<Activity | ScheduledActivity | null>(null);
  const [dragType, setDragType] = useState<'library' | 'schedule' | null>(null);
  
  const addActivity = useScheduleStore((state) => state.addActivity);
  const reorderActivities = useScheduleStore((state) => state.reorderActivities);
  const moveActivityBetweenTimeBlocks = useScheduleStore((state) => state.moveActivityBetweenTimeBlocks);

  const sensors = useSensors(
    useSensor(PointerSensor, { 
      activationConstraint: { distance: 8 }
    }),
    useSensor(TouchSensor, { 
      activationConstraint: { delay: 200, tolerance: 5 } 
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current as DragData;
    
    if (data?.isLibraryItem) {
      setActiveDragItem(data.activity);
      setDragType('library');
    } else if (data?.sortable) {
      setActiveDragItem(data.activity);
      setDragType('schedule');
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over || !active.data.current) return;
    
    const activeData = active.data.current as DragData;
    const overData = over.data.current as DragData;
    
    // Only handle reordering of scheduled items, not library items
    if (activeData.isLibraryItem) return;
    
    const activeContainer = activeData.sortable?.containerId;
    const overContainer = overData?.sortable?.containerId || over.id.toString();
    
    // If moving within the same container, let onDragEnd handle it
    if (activeContainer === overContainer) return;
    
    // Moving between different time blocks
    if (activeContainer && overContainer && activeContainer !== overContainer) {
      const activeActivity = activeData.activity as ScheduledActivity;
      const [activeDay, activeTimeBlock] = activeContainer.split('-');
      const [overDay, overTimeBlock] = overContainer.split('-');
      
      if (activeDay && activeTimeBlock && overDay && overTimeBlock) {
        moveActivityBetweenTimeBlocks(
          activeActivity.instanceId,
          activeDay as 'saturday' | 'sunday',
          activeTimeBlock as 'morning' | 'afternoon' | 'evening',
          overDay as 'saturday' | 'sunday',
          overTimeBlock as 'morning' | 'afternoon' | 'evening',
          overData?.sortable?.index ?? 0
        );
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    const activeData = active.data.current as DragData;

    if (!over || !activeData) {
      setActiveDragItem(null);
      setDragType(null);
      return;
    }

    // Handle dropping a library item onto the schedule
    if (activeData.isLibraryItem) {
      const activity = activeData.activity as Activity;
      const overData = over.data.current as DragData;
      
      // Determine the target container (could be a time block or a sortable item within it)
      let targetContainer = over.id.toString();
      if (overData?.sortable?.containerId) {
        targetContainer = overData.sortable.containerId;
      }
      
      const [day, timeBlock] = targetContainer.split('-');

      if (day && timeBlock && (day === 'saturday' || day === 'sunday')) {
        addActivity(activity, day as 'saturday' | 'sunday', timeBlock as 'morning' | 'afternoon' | 'evening');
      }
    } 
    // Handle reordering within the same time block
    else if (activeData.sortable && !activeData.isLibraryItem) {
      const overData = over.data.current as DragData;
      const activeContainer = activeData.sortable.containerId;
      const overContainer = overData?.sortable?.containerId || over.id.toString();
      
      // Only reorder if within the same container
      if (activeContainer === overContainer && overData?.sortable) {
        const activeIndex = activeData.sortable.index;
        const overIndex = overData.sortable.index;
        
        if (activeIndex !== overIndex) {
          const [day, timeBlock] = activeContainer.split('-');
          if (day && timeBlock) {
            reorderActivities(
              day as 'saturday' | 'sunday',
              timeBlock as 'morning' | 'afternoon' | 'evening',
              activeIndex,
              overIndex
            );
          }
        }
      }
    }
    
    setActiveDragItem(null);
    setDragType(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <main className="container mx-auto p-4 md:p-8">
        <header className="relative text-center mb-8">
          <div className="absolute top-0 right-0">
            <ModeToggle />
          </div>
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Weekendly ✨</h1>
          <p className="text-muted-foreground mt-2">Design your perfect weekend by selecting a date and adding activities.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column is now clean and simple */}
          <div className="md:col-span-1">
            <ActivityLibrary />
          </div>

          {/* Right Column */}
          <div className="md:col-span-2">
            <ScheduleView />
          </div>
        </div>
      </main>

      <DragOverlay dropAnimation={null}>
        {activeDragItem ? (
          <div className="opacity-95 rotate-2 scale-105 shadow-2xl">
            <ActivityCard 
              activity={activeDragItem} 
              variant={dragType === 'library' ? 'library' : 'schedule'} 
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}