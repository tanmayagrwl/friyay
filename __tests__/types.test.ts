import { describe, it, expect } from 'vitest'
import { Activity, ScheduledActivity } from '../types/types'

describe('Types and Data Structures', () => {
  it('should create a valid Activity object', () => {
    const activity: Activity = {
      id: '1',
      title: 'Morning Coffee',
      description: 'Start the day with a fresh cup of coffee',
      category: 'Food',
      vibe: 'Relaxed',
      icon: 'Coffee',
    }

    expect(activity.id).toBe('1')
    expect(activity.title).toBe('Morning Coffee')
    expect(activity.category).toBe('Food')
    expect(activity.vibe).toBe('Relaxed')
  })

  it('should create a valid ScheduledActivity object', () => {
    const scheduledActivity: ScheduledActivity = {
      id: '1',
      title: 'Morning Coffee',
      description: 'Start the day with a fresh cup of coffee',
      category: 'Food',
      vibe: 'Relaxed',
      icon: 'Coffee',
      instanceId: 'instance-1',
      note: 'Extra strong today',
    }

    expect(scheduledActivity.instanceId).toBe('instance-1')
    expect(scheduledActivity.note).toBe('Extra strong today')
    expect(scheduledActivity.id).toBe('1')
  })

  it('should validate activity categories', () => {
    const validCategories = ['Food', 'Outdoors', 'Relax', 'Entertainment']
    
    validCategories.forEach(category => {
      const activity: Activity = {
        id: '1',
        title: 'Test Activity',
        description: 'Test Description',
        category: category as any,
        vibe: 'Relaxed',
        icon: 'Coffee',
      }
      
      expect(validCategories).toContain(activity.category)
    })
  })

  it('should validate activity vibes', () => {
    const validVibes = ['Relaxed', 'Active', 'Social', 'Creative']
    
    validVibes.forEach(vibe => {
      const activity: Activity = {
        id: '1',
        title: 'Test Activity',
        description: 'Test Description',
        category: 'Food',
        vibe: vibe as any,
        icon: 'Coffee',
      }
      
      expect(validVibes).toContain(activity.vibe)
    })
  })
})
