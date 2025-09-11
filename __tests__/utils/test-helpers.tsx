import { Activity, ScheduledActivity } from '../../types/types'
import { render } from '@testing-library/react'
import React from 'react'

export const createMockActivity = (overrides: Partial<Activity> = {}): Activity => ({
  id: 'mock-id',
  title: 'Mock Activity',
  description: 'Mock Description',
  category: 'Food',
  vibe: 'Relaxed',
  icon: 'Coffee',
  ...overrides,
})

export const createMockScheduledActivity = (
  overrides: Partial<ScheduledActivity> = {}
): ScheduledActivity => ({
  ...createMockActivity(),
  instanceId: 'mock-instance-id',
  note: 'Mock note',
  ...overrides,
})

export const createMockWeekendPlan = () => ({
  startDate: '2025-09-13',
  saturday: {
    morning: [createMockScheduledActivity({ title: 'Morning Coffee' })],
    afternoon: [createMockScheduledActivity({ title: 'Lunch' })],
    evening: [createMockScheduledActivity({ title: 'Movie Night' })],
  },
  sunday: {
    morning: [createMockScheduledActivity({ title: 'Breakfast' })],
    afternoon: [createMockScheduledActivity({ title: 'Park Walk' })],
    evening: [createMockScheduledActivity({ title: 'Dinner' })],
  },
})

// Mock implementation for drag and drop testing
export const mockDragAndDrop = {
  startDrag: (sourceElement: HTMLElement) => {
    const dragStartEvent = new DragEvent('dragstart', {
      bubbles: true,
      cancelable: true,
    })
    sourceElement.dispatchEvent(dragStartEvent)
  },
  
  drop: (targetElement: HTMLElement) => {
    const dropEvent = new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
    })
    targetElement.dispatchEvent(dropEvent)
  },
}

// Custom render function with providers if needed
export const renderWithProviders = (ui: React.ReactElement) => {
  // Add any providers your app needs (theme, store, etc.)
  return render(ui)
}

// You can add more test utilities as needed
