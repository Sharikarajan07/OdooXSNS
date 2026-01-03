"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar as CalendarIcon,
  Plane
} from "lucide-react"
import Link from "next/link"

interface Trip {
  id: string
  name: string
  startDate: string
  endDate: string
  status: string
  stops?: Array<{ city: { name: string } }>
}

type Month = {
  year: number
  month: number
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState<Month>(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })
  const [trips, setTrips] = useState<Trip[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/trips')
      const data = await res.json()
      setTrips(data.trips || [])
    } catch (error) {
      console.error('Error fetching trips:', error)
    }
    setIsLoading(false)
  }

  const goToPrevMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 }
      }
      return { year: prev.year, month: prev.month - 1 }
    })
  }

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 }
      }
      return { year: prev.year, month: prev.month + 1 }
    })
  }

  const goToToday = () => {
    const now = new Date()
    setCurrentMonth({ year: now.getFullYear(), month: now.getMonth() })
    setSelectedDate(now)
  }

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const isDateInTrip = (date: Date, trip: Trip) => {
    const tripStart = new Date(trip.startDate)
    const tripEnd = new Date(trip.endDate)
    tripStart.setHours(0, 0, 0, 0)
    tripEnd.setHours(23, 59, 59, 999)
    return date >= tripStart && date <= tripEnd
  }

  const getTripsForDate = (date: Date) => {
    return trips.filter(trip => isDateInTrip(date, trip))
  }

  const getTripsForMonth = () => {
    const monthTrips = trips.filter(trip => {
      const tripStart = new Date(trip.startDate)
      const tripEnd = new Date(trip.endDate)
      const monthStart = new Date(currentMonth.year, currentMonth.month, 1)
      const monthEnd = new Date(currentMonth.year, currentMonth.month + 1, 0)
      return tripEnd >= monthStart && tripStart <= monthEnd
    })
    return monthTrips
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const daysInMonth = getDaysInMonth(currentMonth.year, currentMonth.month)
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth.year, currentMonth.month)
  const today = new Date()
  const monthTrips = getTripsForMonth()

  const getTripColor = (index: number) => {
    const colors = [
      'bg-blue-500/20 border-blue-500',
      'bg-green-500/20 border-green-500',
      'bg-orange-500/20 border-orange-500',
      'bg-purple-500/20 border-purple-500',
      'bg-pink-500/20 border-pink-500',
    ]
    return colors[index % colors.length]
  }

  const selectedDateTrips = selectedDate ? getTripsForDate(selectedDate) : []

  return (
    <div className="container mx-auto py-8 px-4 pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CalendarIcon className="h-8 w-8 text-primary" />
            Trip Calendar
          </h1>
          <p className="text-muted-foreground">View all your trips on a calendar</p>
        </div>
        <Button variant="outline" onClick={goToToday}>
          Today
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <Button variant="ghost" size="icon" onClick={goToPrevMonth}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-bold">
                {monthNames[currentMonth.month]} {currentMonth.year}
              </h2>
              <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before first of month */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const date = new Date(currentMonth.year, currentMonth.month, day)
                  const tripsOnDay = getTripsForDate(date)
                  const isToday =
                    today.getDate() === day &&
                    today.getMonth() === currentMonth.month &&
                    today.getFullYear() === currentMonth.year
                  const isSelected =
                    selectedDate?.getDate() === day &&
                    selectedDate?.getMonth() === currentMonth.month &&
                    selectedDate?.getFullYear() === currentMonth.year

                  return (
                    <button
                      key={day}
                      className={`
                        aspect-square p-1 rounded-lg text-sm relative transition-all
                        hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary
                        ${isSelected ? 'ring-2 ring-primary bg-primary/10' : ''}
                        ${isToday ? 'font-bold' : ''}
                      `}
                      onClick={() => setSelectedDate(date)}
                    >
                      <span className={`
                        ${isToday ? 'bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center mx-auto' : ''}
                      `}>
                        {day}
                      </span>
                      {tripsOnDay.length > 0 && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {tripsOnDay.slice(0, 3).map((_, idx) => (
                            <div
                              key={idx}
                              className="w-1.5 h-1.5 rounded-full bg-primary"
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Month Trips Overview */}
          {monthTrips.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Trips this month</h3>
              <div className="space-y-2">
                {monthTrips.map((trip, index) => (
                  <Link
                    key={trip.id}
                    href={`/trips/${trip.id}`}
                    className={`block p-3 rounded-lg border-l-4 ${getTripColor(index)} hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{trip.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={trip.status === 'completed' ? 'default' : 'secondary'}>
                        {trip.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Selected Date Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate
                  ? selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })
                  : 'Select a date'
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedDate ? (
                <p className="text-muted-foreground text-sm">
                  Click on a date to see trip details
                </p>
              ) : selectedDateTrips.length === 0 ? (
                <div className="text-center py-6">
                  <Plane className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">No trips on this day</p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link href="/trips/new">Plan a Trip</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDateTrips.map(trip => (
                    <Link
                      key={trip.id}
                      href={`/trips/${trip.id}`}
                      className="block p-3 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-medium mb-1">{trip.name}</h4>
                      {trip.stops && trip.stops.length > 0 && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {trip.stops.map(s => s.city.name).join(', ')}
                        </p>
                      )}
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {trip.status}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total trips</span>
                <span className="font-semibold">{trips.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Upcoming</span>
                <span className="font-semibold">
                  {trips.filter(t => t.status === 'upcoming').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-semibold">
                  {trips.filter(t => t.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">This month</span>
                <span className="font-semibold">{monthTrips.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
