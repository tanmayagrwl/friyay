// src/components/activity-library.tsx
'use client';

import { useState } from 'react';
import { ALL_ACTIVITIES } from '@/data';
import { Activity } from '../types/types';
import { ActivityCard } from '@/components/activity-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';

const CATEGORIES = ['All', 'Food', 'Outdoors', 'Relax', 'Entertainment', 'Family'];
const VIBES = ['Energetic', 'Relaxed', 'Adventurous', 'Creative', 'Social'];
export function ActivityLibrary() {
  // State for managing the "Add New" dialog
  const [isNewActivityDialogOpen, setIsNewActivityDialogOpen] = useState(false);
  
  // State for search and filter functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // We will add state for our own custom activities later
  const [customActivities, setCustomActivities] = useState<Activity[]>([]);
  
  const allAvailableActivities = [...ALL_ACTIVITIES, ...customActivities];

  // Derived state: The list of activities to display based on search and filter
  const filteredActivities = allAvailableActivities.filter(activity => {
    const matchesFilter = activeFilter === 'All' || activity.category === activeFilter;
    const matchesSearch = searchTerm.trim() === '' ||
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateNewActivity = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newActivity: Activity = {
      id: crypto.randomUUID(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as Activity['category'],
      vibe: formData.get('vibe') as Activity['vibe'], // Default vibe for now
      icon: 'Palmtree', // Default icon
    };
    setCustomActivities(prev => [...prev, newActivity]);
    setIsNewActivityDialogOpen(false); // Close the dialog
  };

  return (
    <div className="sticky top-8">
      <h2 className="text-2xl font-semibold mb-4">Activity Library</h2>
      
      {/* Search and "Add New" Button */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Search activities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Dialog open={isNewActivityDialogOpen} onOpenChange={setIsNewActivityDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <PlusCircle className="h-4 w-4 mr-2" /> New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Custom Activity</DialogTitle></DialogHeader>
            <form onSubmit={handleCreateNewActivity} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input id="title" name="title" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Input id="description" name="description" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Select name="category" required>
                  <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter(c => c !== 'All').map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                  
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vibe" className="text-right">Vibe</Label>
                <Select name="vibe" required>
                  <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a vibe" /></SelectTrigger>
                  <SelectContent>
                    {VIBES.map(vibe => <SelectItem key={vibe} value={vibe}>{vibe}</SelectItem>)}
                  </SelectContent>
                  
                </Select>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map(category => (
          <Button
            key={category}
            variant={activeFilter === category ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveFilter(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      
      {/* Activity List */}
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <ActivityCard 
              key={activity.id} 
              activity={activity} 
              variant="library"
            />
          ))
        ) : (
          <p className="text-muted-foreground text-center p-4">No activities found.</p>
        )}
      </div>
    </div>
  );
}