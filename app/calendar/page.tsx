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
      'bg-cyan-500/20 border-cyan-500',
      'bg-purple-500/20 border-purple-500',
      'bg-emerald-500/20 border-emerald-500',
      'bg-indigo-500/20 border-indigo-500',
    ]
    return colors[index % colors.length]
  }

  const selectedDateTrips = selectedDate ? getTripsForDate(selectedDate) : []

  return (
    <div className="container mx-auto py-8 px-4 pb-24 md:pb-8 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/25">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            Trip Calendar
          </h1>
          <p className="text-gray-500 mt-1 ml-14">View all your trips on a calendar</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30" onClick={goToToday}>
          Today
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card className="border-blue-100/50 shadow-xl shadow-blue-500/5">
            <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
              <Button variant="ghost" size="icon" onClick={goToPrevMonth} className="hover:bg-blue-100 hover:text-blue-600">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {monthNames[currentMonth.month]} {currentMonth.year}
              </h2>
              <Button variant="ghost" size="icon" onClick={goToNextMonth} className="hover:bg-blue-100 hover:text-blue-600">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
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
                        aspect-square p-1 rounded-lg text-sm relative transition-all duration-300
                        hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400
                        ${isSelected ? 'ring-2 ring-blue-400 bg-blue-50' : ''}
                        ${isToday ? 'font-bold' : ''}
                      `}
                      onClick={() => setSelectedDate(date)}
                    >
                      <span className={`
                        ${isToday ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white w-7 h-7 rounded-full flex items-center justify-center mx-auto shadow-lg' : ''}
                      `}>
                        {day}
                      </span>
                      {tripsOnDay.length > 0 && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {tripsOnDay.slice(0, 3).map((_, idx) => (
                            <div
                              key={idx}
                              className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
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
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Trips this month</h3>
              <div className="space-y-2">
                {monthTrips.map((trip, index) => (
                  <Link
                    key={trip.id}
                    href={`/trips/${trip.id}`}
                    className={`block p-3 rounded-lg border-l-4 ${getTripColor(index)} hover:shadow-lg transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{trip.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={
                        trip.status === 'completed' 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0' 
                          : trip.status === 'ongoing'
                            ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0'
                      }>
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
          <Card className="border-blue-100/50 shadow-lg shadow-blue-500/5">
            <CardHeader className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
              <CardTitle className="text-lg text-gray-700">
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
            <CardContent className="pt-4">
              {!selectedDate ? (
                <p className="text-gray-500 text-sm">
                  Click on a date to see trip details
                </p>
              ) : selectedDateTrips.length === 0 ? (
                <div className="text-center py-6">
                  <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full p-3 w-14 h-14 mx-auto mb-2 flex items-center justify-center">
                    <Plane className="h-6 w-6 text-blue-400" />
                  </div>
                  <p className="text-gray-500 text-sm">No trips on this day</p>
                  <Button size="sm" className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white" asChild>
                    <Link href="/trips/new">Plan a Trip</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDateTrips.map(trip => (
                    <Link
                      key={trip.id}
                      href={`/trips/${trip.id}`}
                      className="block p-3 rounded-lg border border-blue-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 bg-gradient-to-r from-white to-blue-50/50"
                    >
                      <h4 className="font-medium mb-1 text-gray-800">{trip.name}</h4>
                      {trip.stops && trip.stops.length > 0 && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-blue-400" />
                          {trip.stops.map(s => s.city.name).join(', ')}
                        </p>
                      )}
                      <Badge className="mt-2 text-xs bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                        {trip.status}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-blue-100/50 shadow-lg shadow-blue-500/5">
            <CardHeader className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
              <CardTitle className="text-lg text-gray-700">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total trips</span>
                <span className="font-semibold text-blue-600">{trips.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Upcoming</span>
                <span className="font-semibold text-cyan-500">
                  {trips.filter(t => t.status === 'upcoming').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Completed</span>
                <span className="font-semibold text-emerald-500">
                  {trips.filter(t => t.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">This month</span>
                <span className="font-semibold text-amber-500">{monthTrips.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
