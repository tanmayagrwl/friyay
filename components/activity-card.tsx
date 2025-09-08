
import { Activity } from '../types/types';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Badge } from './ui/badge'; // We'll add this next
import { Book, ChefHat, Coffee, Film, Mountain, Palmtree } from 'lucide-react';

// A helper to map icon names from our data to actual components
const iconMap = {
  Coffee: <Coffee className="h-5 w-5" />,
  Mountain: <Mountain className="h-5 w-5" />,
  Film: <Film className="h-5 w-5" />,
  Palmtree: <Palmtree className="h-5 w-5" />,
  Book: <Book className="h-5 w-5" />,
  ChefHat: <ChefHat className="h-5 w-5" />,
};

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow cursor-grab">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{activity.title}</CardTitle>
          {iconMap[activity.icon as keyof typeof iconMap]}
        </div>
        <CardDescription>{activity.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Badge variant="outline" className="mr-2">{activity.category}</Badge>
        <Badge variant="secondary">{activity.vibe}</Badge>
      </CardFooter>
    </Card>
  );
}
