
'use client'; 

import { ALL_ACTIVITIES } from '@/data';
import { ActivityCard } from '@/components/activity-card';
import { ScheduleView } from '@/components/schedule-view';
import { ModeToggle } from '@/components/mode-toggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function Home() {
  // We will add state here later for search and filtering
  // const [searchTerm, setSearchTerm] = useState('');
  // const [filteredActivities, setFilteredActivities] = useState(ALL_ACTIVITIES);

  return (
    <main className="container mx-auto p-4 md:p-8">
      {/* Header remains largely the same */}
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
        {/* --- Left Column: Activity Library --- */}
        <div className="md:col-span-1">
          <div className="sticky top-8"> {/* Makes the library stick on scroll */}
            <h2 className="text-2xl font-semibold mb-4">Activity Library</h2>

            {/* Placeholder for Search and Add New Task */}
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Search activities..."
                // value={searchTerm}
                // onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline">
                <PlusCircle className="h-4 w-4 mr-2" /> New
              </Button>
            </div>
            
            {/* Placeholder for Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {/* We'll make these functional later */}
              <Button variant="ghost" size="sm">All</Button>
              <Button variant="ghost" size="sm">🍔 Food</Button>
              <Button variant="ghost" size="sm">🌲 Outdoors</Button>
              <Button variant="ghost" size="sm">🧘 Relax</Button>
            </div>

            {/* Activity List */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {ALL_ACTIVITIES.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </div>

        {/* --- Right Column: Schedule --- */}
        <div className="md:col-span-2">
          {/* We replace the static placeholder with our dynamic component */}
          <ScheduleView />
        </div>
      </div>
    </main>
  );
}