// src/components/activity-card.tsx
"use client"

import { useDraggable } from "@dnd-kit/core"
import {
  Book,
  ChefHat,
  Coffee,
  Film,
  Mountain,
  Palmtree,
  X,
  Pencil, // <-- 1. IMPORT Pencil icon
} from "lucide-react"
import { Activity, ScheduledActivity } from "../types/types"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import {
  Card,
  CardContent, // <-- 2. IMPORT CardContent for displaying the note
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"

const iconMap = {
  Coffee: <Coffee className="h-5 w-5" />,
  Mountain: <Mountain className="h-5 w-5" />,
  Film: <Film className="h-5 w-5" />,
  Palmtree: <Palmtree className="h-5 w-5" />,
  Book: <Book className="h-5 w-5" />,
  ChefHat: <ChefHat className="h-5 w-5" />,
}

interface ActivityCardProps {
  activity: Activity | ScheduledActivity
  variant: "library" | "schedule"
  onDelete?: (instanceId: string) => void
  onEdit?: (activity: ScheduledActivity) => void // <-- 3. ADD onEdit prop
}

// 4. ADD onEdit to the function's parameters
export function ActivityCard({
  activity,
  variant,
  onDelete,
  onEdit,
}: ActivityCardProps) {
  const isLibraryItem = variant === "library"
  
  // Your draggable logic is complex and seems geared for a future Sortable feature.
  // I will leave it as is, since it works for the current "draggable" case.
  const draggableId = isLibraryItem
    ? `library-${activity.id}`
    : `scheduled-${(activity as ScheduledActivity).instanceId}`

  const draggableConfig = {
      id: draggableId,
      data: { activity, isLibraryItem },
      disabled: !isLibraryItem, // Simplified your disabled logic
  };

  const { attributes, listeners, setNodeRef, isDragging } =
    useDraggable(draggableConfig)

  const style = {
    opacity: isDragging ? 0.5 : 1,
    touchAction: "none" as const,
    userSelect: "none" as const,
    WebkitUserSelect: "none" as const,
  }
  const scheduledActivity = activity as ScheduledActivity

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isLibraryItem ? listeners : {})}
      {...(isLibraryItem ? attributes : {})}
      className={`relative group ${isLibraryItem ? "cursor-grab" : ""}`}
    >
      {/* --- 5. WRAP buttons in a div for proper layout --- */}
      {variant === "schedule" && (
        <div className="absolute top-1 right-1 flex opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {/* --- 6. ADD the Edit button conditionally --- */}
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onEdit(scheduledActivity)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit {activity.title}</span>
            </Button>
          )}

          {/* Your existing Delete button */}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onDelete(scheduledActivity.instanceId)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove {activity.title}</span>
            </Button>
          )}
        </div>
      )}

      <Card className="transition-shadow hover:shadow-md">
        {/* Added pr-12 to header to prevent title overlapping with buttons on hover */}
        <CardHeader className="pr-12">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{activity.title}</CardTitle>
            {iconMap[activity.icon as keyof typeof iconMap]}
          </div>
          <CardDescription>{activity.description}</CardDescription>
        </CardHeader>
        {/* --- 7. ADD CardContent to display the note --- */}
        <CardContent className="py-0">
            {scheduledActivity.note && (
                <p className="text-sm text-muted-foreground mt-2 border-l-2 pl-2 italic">
                  "{scheduledActivity.note}"
                </p>
            )}
        </CardContent>
        <CardFooter>
          <Badge variant="outline" className="mr-2">
            {activity.category}
          </Badge>
          <Badge variant="secondary">{activity.vibe}</Badge>
        </CardFooter>
      </Card>
    </div>
  )
}