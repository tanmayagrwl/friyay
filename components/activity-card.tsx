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
  Pencil,
} from "lucide-react"
import { Activity, ScheduledActivity } from "../types/types"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import {
  Card,
  CardContent,
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
  onEdit?: (activity: ScheduledActivity) => void
  isDragOverlay?: boolean
}

export function ActivityCard({
  activity,
  variant,
  onDelete,
  onEdit,
  isDragOverlay = false,
}: ActivityCardProps) {
  const isLibraryItem = variant === "library"
  
  const draggableConfig = isLibraryItem ? {
    id: `library-${activity.id}`,
    data: { 
      activity, 
      isLibraryItem: true 
    },
  } : undefined;

  const draggableResult = useDraggable(draggableConfig || { id: 'dummy', disabled: true });
  
  const { attributes, listeners, setNodeRef, isDragging } = draggableResult;

  const style = {
    opacity: isDragging ? 0.5 : 1,
    touchAction: "none" as const,
    userSelect: "none" as const,
    WebkitUserSelect: "none" as const,
  }
  
  const scheduledActivity = activity as ScheduledActivity

  return (
    <div
      ref={isLibraryItem ? setNodeRef : undefined}
      style={isLibraryItem ? style : undefined}
      {...(isLibraryItem ? listeners : {})}
      {...(isLibraryItem ? attributes : {})}
      className={`relative group ${isLibraryItem ? "cursor-grab active:cursor-grabbing" : ""} ${
        isDragOverlay ? "transform rotate-2 scale-105" : ""
      }`}
    >
      {variant === "schedule" && !isDragOverlay && (
        <div className="absolute top-1 right-1 flex opacity-0 group-hover:opacity-100 transition-opacity z-10">
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
        <CardHeader className="pr-12">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{activity.title}</CardTitle>
            {iconMap[activity.icon as keyof typeof iconMap]}
          </div>
          <CardDescription>{activity.description}</CardDescription>
        </CardHeader>
        <CardContent className="py-0">
            {scheduledActivity.note && (
                <p className="text-sm text-muted-foreground mt-2 border-l-2 pl-2 italic">
                  &quot;{scheduledActivity.note}&quot;
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