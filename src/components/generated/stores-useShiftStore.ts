"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ShiftActivations {
  voice: number
  bts: number
  tfb: number
}

export interface ShiftIncremental {
  p360: number
  acc: number
  devices: number
  csatScore: number
  csatCount: number
}

export interface ShiftTargets {
  voice?: number
  bts?: number
  tfb?: number
  p360?: number
  acc?: number
  devices?: number
  csatTarget?: number
}

export interface ShiftDeficits {
  voice?: number
  bts?: number
  tfb?: number
  p360?: number
  acc?: number
  devices?: number
  csatGap?: number
}

export interface ShiftState {
  date: string
  startedAt: number | null
  activations: ShiftActivations
  incremental: ShiftIncremental
  targets: ShiftTargets
  deficits: ShiftDeficits
  notes?: string
  streakDays: number
  lastSavedAt: number | null
}

export interface ShiftStore extends ShiftState {
  // Derived selectors
  progressPct: (code: string) => number
  remaining: (code: string) => number
  csatAvg: () => number
  
  // Actions
  inc: (metricPath: string) => void
  dec: (metricPath: string) => void
  setTarget: (code: string, value: number) => void
  syncTargetsFromCatchUp: (targetMap: Record<string, number>) => void
  startShift: () => void
  endShift: () => void
  resetShift: (keepDate?: boolean) => void
  saveToLocal: () => void
  loadFromLocal: (date: string) => void
  exportJSON: () => string
}

const getInitialState = (): ShiftState => ({
  date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  startedAt: null,
  activations: {
    voice: 0,
    bts: 0,
    tfb: 0
  },
  incremental: {
    p360: 0,
    acc: 0,
    devices: 0,
    csatScore: 0,
    csatCount: 0
  },
  targets: {},
  deficits: {},
  notes: '',
  streakDays: 0,
  lastSavedAt: null
})

const clampToZero = (value: number): number => Math.max(0, value)

const getNestedValue = (obj: any, path: string): number => {
  const keys = path.split('.')
  let current = obj
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key]
    } else {
      return 0
    }
  }
  return typeof current === 'number' ? current : 0
}

const setNestedValue = (obj: any, path: string, value: number): void => {
  const keys = path.split('.')
  let current = obj
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key]
  }
  const lastKey = keys[keys.length - 1]
  current[lastKey] = clampToZero(value)
}

export const useShiftStore = create<ShiftStore>()(
  persist(
    (set, get) => ({
      ...getInitialState(),

      // Derived selectors
      progressPct: (code: string) => {
        const state = get()
        const actual = getNestedValue(state.activations, code) + getNestedValue(state.incremental, code)
        const target = state.targets[code as keyof ShiftTargets]
        
        if (!target || target === 0) return 0
        return Math.min((actual / target) * 100, 100)
      },

      remaining: (code: string) => {
        const state = get()
        const actual = getNestedValue(state.activations, code) + getNestedValue(state.incremental, code)
        const target = state.targets[code as keyof ShiftTargets]
        
        if (!target) return 0
        return Math.max(target - actual, 0)
      },

      csatAvg: () => {
        const state = get()
        const { csatScore, csatCount } = state.incremental
        return csatCount > 0 ? csatScore / csatCount : 0
      },

      // Actions
      inc: (metricPath: string) => {
        set((state) => {
          const newState = { ...state }
          const currentValue = getNestedValue(newState, metricPath)
          
          // Special handling for csatScore - allow decimals
          if (metricPath === 'incremental.csatScore') {
            setNestedValue(newState, metricPath, currentValue + 0.1)
          } else {
            setNestedValue(newState, metricPath, currentValue + 1)
          }
          
          return newState
        })
      },

      dec: (metricPath: string) => {
        set((state) => {
          const newState = { ...state }
          const currentValue = getNestedValue(newState, metricPath)
          
          // Special handling for csatScore - allow decimals
          if (metricPath === 'incremental.csatScore') {
            setNestedValue(newState, metricPath, currentValue - 0.1)
          } else {
            setNestedValue(newState, metricPath, currentValue - 1)
          }
          
          return newState
        })
      },

      setTarget: (code: string, value: number) => {
        set((state) => ({
          ...state,
          targets: {
            ...state.targets,
            [code]: clampToZero(value)
          }
        }))
      },

      syncTargetsFromCatchUp: (targetMap: Record<string, number>) => {
        set((state) => ({
          ...state,
          targets: {
            ...state.targets,
            ...Object.fromEntries(
              Object.entries(targetMap).map(([key, value]) => [key, clampToZero(value)])
            )
          }
        }))
      },

      startShift: () => {
        set((state) => ({
          ...state,
          startedAt: Date.now(),
          date: new Date().toISOString().split('T')[0]
        }))
      },

      endShift: () => {
        set((state) => ({
          ...state,
          lastSavedAt: Date.now()
        }))
      },

      resetShift: (keepDate = false) => {
        set((state) => ({
          ...getInitialState(),
          date: keepDate ? state.date : new Date().toISOString().split('T')[0],
          streakDays: state.streakDays,
          targets: state.targets, // Preserve targets
          deficits: state.deficits // Preserve deficits
        }))
      },

      saveToLocal: () => {
        const state = get()
        const key = `shift-${state.date}`
        const dataToSave = {
          ...state,
          lastSavedAt: Date.now()
        }
        
        try {
          localStorage.setItem(key, JSON.stringify(dataToSave))
          set({ lastSavedAt: Date.now() })
        } catch (error) {
          console.error('Failed to save shift data:', error)
        }
      },

      loadFromLocal: (date: string) => {
        const key = `shift-${date}`
        
        try {
          const saved = localStorage.getItem(key)
          if (saved) {
            const parsedData = JSON.parse(saved)
            set({
              ...parsedData,
              date // Ensure date matches the requested date
            })
          } else {
            // No saved data for this date, reset with the requested date
            set({
              ...getInitialState(),
              date
            })
          }
        } catch (error) {
          console.error('Failed to load shift data:', error)
          set({
            ...getInitialState(),
            date
          })
        }
      },

      exportJSON: () => {
        const state = get()
        return JSON.stringify(state, null, 2)
      }
    }),
    {
      name: 'shift-store',
      partialize: (state) => ({
        date: state.date,
        startedAt: state.startedAt,
        activations: state.activations,
        incremental: state.incremental,
        targets: state.targets,
        deficits: state.deficits,
        notes: state.notes,
        streakDays: state.streakDays,
        lastSavedAt: state.lastSavedAt
      })
    }
  )
)