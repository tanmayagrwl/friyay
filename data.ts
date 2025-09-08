// src/data.ts
import { Activity } from './types/types';

export const ALL_ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'Pancake Brunch',
    description: 'A classic weekend kick-off with syrup and coffee.',
    category: 'Food',
    vibe: 'Relaxed',
    icon: 'Coffee',
  },
  {
    id: '2',
    title: 'Hiking Trip',
    description: 'Explore local trails and enjoy nature.',
    category: 'Outdoors',
    vibe: 'Active',
    icon: 'Mountain',
  },
  {
    id: '3',
    title: 'Movie Night',
    description: 'Cozy up with popcorn and a good film.',
    category: 'Relax',
    vibe: 'Relaxed',
    icon: 'Film',
  },
  {
    id: '4',
    title: 'Visit a Museum',
    description: 'Get a dose of culture and inspiration.',
    category: 'Entertainment',
    vibe: 'Creative',
    icon: 'Palmtree', // Just using a placeholder for now
  },
  {
    id: '5',
    title: 'Read a Book in the Park',
    description: 'Enjoy a good story under the sun.',
    category: 'Relax',
    vibe: 'Relaxed',
    icon: 'Book',
  },
  {
    id: '6',
    title: 'Try a New Recipe',
    description: 'Cook something new and delicious at home.',
    category: 'Food',
    vibe: 'Creative',
    icon: 'ChefHat',
  },
];