'use client';

import { useState, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useScheduleStore } from '@/store/schedule-store';
import { WeekendSelector } from './weekend-selector';
import { DaySchedule, ScheduledActivity } from '../types/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ActivityCard } from './activity-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { GripVertical } from 'lucide-react';
import { ImageExportButton } from './image-export-button';

function SortableActivityCard({ 
  activity, 
  onDelete,
  onEdit,
  containerId,
  index
}: { 
  activity: ScheduledActivity; 
  onDelete: (instanceId: string) => void;
  onEdit: (activity: ScheduledActivity) => void; 
  containerId: string;
  index: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: activity.instanceId,
    data: {
      activity,
      isLibraryItem: false,
      sortable: {
        containerId,
        index
      }
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`mb-2 group relative ${isDragging ? 'z-50' : ''}`}
    >
      <div className="flex items-center gap-2">
        <div 
          {...attributes}
          {...listeners}
          className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded flex-shrink-0"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <ActivityCard 
            activity={activity} 
            variant="schedule"
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      </div>
    </div>
  );
}

function TimeBlockDroppable({ 
  day, 
  timeBlock, 
  activities = [],
  onDelete,
  onEdit
}: { 
  day: 'saturday' | 'sunday'; 
  timeBlock: 'morning' | 'afternoon' | 'evening'; 
  activities?: ScheduledActivity[];
  onDelete: (instanceId: string) => void;
  onEdit: (activity: ScheduledActivity) => void;
}) {
  const containerId = `${day}-${timeBlock}`;
  const { setNodeRef, isOver } = useDroppable({ 
    id: containerId,
    data: {
      isLibraryItem: false,
      sortable: {
        containerId
      }
    }
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-muted/50 p-2 rounded-md min-h-[80px] transition-all duration-200 ${
        isOver ? 'bg-primary/20 border-2 border-primary border-dashed scale-[1.02]' : 'border-2 border-transparent'
      }`}
    >
      <SortableContext items={activities.map(a => a.instanceId)} strategy={verticalListSortingStrategy}>
        {activities.map((activity, index) => (
          <SortableActivityCard 
            key={activity.instanceId}
            activity={activity}
            onDelete={onDelete}
            onEdit={onEdit}
            containerId={containerId}
            index={index}
          />
        ))}
      </SortableContext>
      {isOver && activities.length === 0 && (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          Drop here
        </div>
      )}
    </div>
  );
}

function DayColumn({ 
  day, 
  dayName, 
  onDelete, 
  onEdit 
}: { 
  day?: DaySchedule; 
  dayName: 'saturday' | 'sunday';
  onDelete: (instanceId: string) => void;
  onEdit: (activity: ScheduledActivity) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{dayName.charAt(0).toUpperCase() + dayName.slice(1)}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2 text-muted-foreground">Morning</h3>
          <TimeBlockDroppable 
            day={dayName} 
            timeBlock="morning"
            activities={day?.morning || []}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-muted-foreground">Afternoon</h3>
          <TimeBlockDroppable 
            day={dayName} 
            timeBlock="afternoon"
            activities={day?.afternoon || []}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-muted-foreground">Evening</h3>
          <TimeBlockDroppable 
            day={dayName} 
            timeBlock="evening"
            activities={day?.evening || []}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      </CardContent>
    </Card>
  );
}


export function ScheduleView() {
  const activePlan = useScheduleStore((state) => state.getActivePlan());
  const removeActivity = useScheduleStore((state) => state.removeActivity);
  const updateActivityNote = useScheduleStore((state) => state.updateActivityNote);

  const [editingActivity, setEditingActivity] = useState<ScheduledActivity | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const scheduleContainerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  const handleOpenEditDialog = (activity: ScheduledActivity) => {
    setEditingActivity(activity);
    setNoteContent(activity.note || '');
  };

  const handleSaveNote = () => {
    if (editingActivity) {
      updateActivityNote(editingActivity.instanceId, noteContent);
      setEditingActivity(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
        <h2 className="text-2xl font-semibold">Your Schedule</h2>
        <div className="flex flex-col-reverse sm:flex-row gap-2 items-center">
          <ImageExportButton exportRef={scheduleContainerRef} />
          <WeekendSelector />
        </div>
      </div>

      <div ref={scheduleContainerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-background rounded-lg">
        <DayColumn 
          day={activePlan?.saturday} 
          dayName="saturday" 
          onDelete={removeActivity}
          onEdit={handleOpenEditDialog}
        />
        <DayColumn 
          day={activePlan?.sunday} 
          dayName="sunday" 
          onDelete={removeActivity}
          onEdit={handleOpenEditDialog}
        />
      </div>

      {!activePlan && (
         <div className="p-8 mt-6 text-center bg-muted/40 rounded-lg">
           <p className="text-lg">This weekend is a blank canvas!</p>
           <p className="text-muted-foreground text-sm">Drag activities from the library to start planning.</p>
         </div>
      )}

      <Dialog open={!!editingActivity} onOpenChange={() => setEditingActivity(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit: {editingActivity?.title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right">Note</Label>
              <Textarea
                id="note"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="col-span-3"
                placeholder="Add a personal note (e.g., location, time, reminder)..."
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveNote}>Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}