'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface Activity {
  id: string
  day: number
  name: string
  cost: number
}

export interface Trip {
  id: string
  name: string
  destination: string
  startDate: string
  endDate: string
  activities: Activity[]
  status: 'ongoing' | 'upcoming' | 'completed'
}

interface TripContextType {
  trips: Trip[]
  currentTrip: Trip | null
  setCurrentTrip: (trip: Trip | null) => void
  addTrip: (trip: Trip) => void
  updateTrip: (trip: Trip) => void
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const TripContext = createContext<TripContextType | undefined>(undefined)

export function TripProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([])
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const addTrip = (trip: Trip) => {
    setTrips((prev) => [...prev, trip])
  }

  const updateTrip = (updatedTrip: Trip) => {
    setTrips((prev) =>
      prev.map((trip) => (trip.id === updatedTrip.id ? updatedTrip : trip))
    )
    if (currentTrip?.id === updatedTrip.id) {
      setCurrentTrip(updatedTrip)
    }
  }

  const login = () => setIsAuthenticated(true)
  const logout = () => setIsAuthenticated(false)

  return (
    <TripContext.Provider
      value={{
        trips,
        currentTrip,
        setCurrentTrip,
        addTrip,
        updateTrip,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </TripContext.Provider>
  )
}

export function useTrip() {
  const context = useContext(TripContext)
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider')
  }
  return context
}
