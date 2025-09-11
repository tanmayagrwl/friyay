import { describe, it, expect, beforeEach } from 'vitest'
import { useScheduleStore } from '../store/schedule-store'
import { Activity } from '../types/types'

const mockActivity: Activity = {
  id: '1',
  title: 'Test Activity',
  description: 'Test Description',
  category: 'Food',
  vibe: 'Relaxed',
  icon: 'Coffee',
}

describe('ScheduleStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useScheduleStore.setState((state) => ({
      ...state,
      plans: {},
      activeWeekendStartDate: null,
    }))
  })

  it('initializes with empty state', () => {
    const state = useScheduleStore.getState()
    expect(state.plans).toEqual({})
    expect(state.activeWeekendStartDate).toBe(null)
  })

  it('initializes active weekend', () => {
    const { initializeActiveWeekend } = useScheduleStore.getState()
    initializeActiveWeekend()
    
    const { activeWeekendStartDate } = useScheduleStore.getState()
    expect(activeWeekendStartDate).toBeTruthy()
    expect(typeof activeWeekendStartDate).toBe('string')
  })

  it('sets active weekend date', () => {
    const { setActiveWeekend } = useScheduleStore.getState()
    const testDate = '2025-09-13'
    
    setActiveWeekend(testDate)
    
    const { activeWeekendStartDate } = useScheduleStore.getState()
    expect(activeWeekendStartDate).toBe(testDate)
  })

  it('adds activity to schedule', () => {
    const { setActiveWeekend, addActivity } = useScheduleStore.getState()
    const testDate = '2025-09-13'
    
    setActiveWeekend(testDate)
    addActivity(mockActivity, 'saturday', 'morning')
    
    const { plans } = useScheduleStore.getState()
    expect(plans[testDate]).toBeDefined()
    expect(plans[testDate].saturday.morning).toHaveLength(1)
    expect(plans[testDate].saturday.morning[0].title).toBe('Test Activity')
    expect(plans[testDate].saturday.morning[0].instanceId).toBeTruthy()
  })

  it('removes activity from schedule', () => {
    const { setActiveWeekend, addActivity, removeActivity } = useScheduleStore.getState()
    const testDate = '2025-09-13'
    
    setActiveWeekend(testDate)
    addActivity(mockActivity, 'saturday', 'morning')
    
    const { plans } = useScheduleStore.getState()
    const instanceId = plans[testDate].saturday.morning[0].instanceId
    
    removeActivity(instanceId)
    
    const updatedPlans = useScheduleStore.getState().plans
    expect(updatedPlans[testDate].saturday.morning).toHaveLength(0)
  })

  it('updates activity note', () => {
    const { setActiveWeekend, addActivity, updateActivityNote } = useScheduleStore.getState()
    const testDate = '2025-09-13'
    
    setActiveWeekend(testDate)
    addActivity(mockActivity, 'saturday', 'morning')
    
    const { plans } = useScheduleStore.getState()
    const instanceId = plans[testDate].saturday.morning[0].instanceId
    
    updateActivityNote(instanceId, 'Updated note')
    
    const updatedPlans = useScheduleStore.getState().plans
    expect(updatedPlans[testDate].saturday.morning[0].note).toBe('Updated note')
  })

  it('gets active plan', () => {
    const { setActiveWeekend, addActivity, getActivePlan } = useScheduleStore.getState()
    const testDate = '2025-09-13'
    
    setActiveWeekend(testDate)
    addActivity(mockActivity, 'saturday', 'morning')
    
    const activePlan = getActivePlan()
    expect(activePlan).toBeDefined()
    expect(activePlan?.startDate).toBe(testDate)
    expect(activePlan?.saturday.morning).toHaveLength(1)
  })
})
