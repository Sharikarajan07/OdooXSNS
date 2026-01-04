"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Edit2,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle2,
  Share2,
  Link as LinkIcon,
  Twitter,
  Facebook,
  Copy,
  Check,
  PieChart,
  List,
  CalendarDays,
  Plane,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

interface Activity {
  id: string
  name: string
  cost: number
  category?: string
  duration?: number
}

interface StopActivity {
  id: string
  activity: Activity
  startTime?: string | null
  orderIndex: number
  dayIndex?: number // Which day within the stop (0 = first day)
}

interface Stop {
  id: string
  city: {
    name: string
    country: string
    image: string
  }
  arrivalDate: string
  departureDate: string
  activities: StopActivity[]
  orderIndex: number
}

interface Trip {
  id: string
  name: string
  description: string
  coverImage: string
  startDate: string
  endDate: string
  status: string
  totalBudget: number
  shareCode: string
  isPublic: boolean
  stops: Stop[]
  expenses: Array<{ category: string; amount: number }>
}

interface DaySchedule {
  date: Date
  dateStr: string
  dayNumber: number
  activities: Array<{
    stopId: string
    stopActivity: StopActivity
    city: string
    country: string
  }>
}

export default function TripDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'timeline' | 'list' | 'calendar'>('timeline')
  const [copied, setCopied] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date())

  // Time picker dialog state
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false)
  const [selectedActivityForTime, setSelectedActivityForTime] = useState<{stopId: string, activityId: string, currentTime: string | null} | null>(null)
  const [newTime, setNewTime] = useState("")

  useEffect(() => {
    fetchTrip()
  }, [id])

  const fetchTrip = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/trips/${id}`)
      const data = await res.json()
      if (data.trip) {
        setTrip(data.trip)
        // Set calendar to trip start date
        if (data.trip.startDate) {
          setCalendarMonth(new Date(data.trip.startDate))
        }
      }
    } catch (error) {
      console.error('Error fetching trip:', error)
    }
    setIsLoading(false)
  }

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/share/${trip?.shareCode}`
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Helper to parse date string as local date (avoiding timezone issues)
  const parseLocalDate = (dateStr: string): Date => {
    // Handle both "2026-01-10" and Date objects
    const str = typeof dateStr === 'string' ? dateStr : new Date(dateStr).toISOString()
    const [year, month, day] = str.split('T')[0].split('-').map(Number)
    return new Date(year, month - 1, day) // month is 0-indexed
  }

  // Helper to normalize date to YYYY-MM-DD string for comparison
  const toDateString = (date: Date | string): string => {
    if (typeof date === 'string') {
      // If it's already a string like "2026-01-10", extract the date part
      return date.split('T')[0]
    }
    const d = date
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  // Generate day-wise schedule
  const getDaySchedule = (): DaySchedule[] => {
    if (!trip) return []
    
    const startDate = parseLocalDate(trip.startDate)
    const endDate = parseLocalDate(trip.endDate)
    const days: DaySchedule[] = []
    
    let currentDate = new Date(startDate)
    let dayNumber = 1
    
    while (currentDate <= endDate) {
      const dateStr = toDateString(currentDate)
      const dayActivities: DaySchedule['activities'] = []
      
      // Find activities for this day based on stop dates
      trip.stops.forEach(stop => {
        const arrivalDateStr = toDateString(stop.arrivalDate)
        const departureDateStr = toDateString(stop.departureDate)
        const currentDateStr = toDateString(currentDate)
        
        // Check if current date falls within the stop period
        if (currentDateStr >= arrivalDateStr && currentDateStr <= departureDateStr) {
          // Calculate which day within the stop this is (0-indexed)
          const arrivalDate = parseLocalDate(arrivalDateStr)
          const dayWithinStop = Math.round((currentDate.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24))
          
          // Only include activities that belong to this specific day
          stop.activities.forEach(act => {
            // If activity has a dayIndex, filter by it; otherwise show on first day only
            const activityDayIndex = act.dayIndex ?? 0
            if (activityDayIndex === dayWithinStop) {
              dayActivities.push({
                stopId: stop.id,
                stopActivity: act,
                city: stop.city.name,
                country: stop.city.country
              })
            }
          })
        }
      })

      // Sort by time if available
      dayActivities.sort((a, b) => {
        if (!a.stopActivity.startTime) return 1
        if (!b.stopActivity.startTime) return -1
        return a.stopActivity.startTime.localeCompare(b.stopActivity.startTime)
      })
      
      days.push({
        date: new Date(currentDate),
        dateStr,
        dayNumber,
        activities: dayActivities
      })
      
      currentDate.setDate(currentDate.getDate() + 1)
      dayNumber++
    }
    
    return days
  }

  const daySchedule = getDaySchedule()

  const handleOpenTimePicker = (stopId: string, activityId: string, currentTime: string | null) => {
    setSelectedActivityForTime({ stopId, activityId, currentTime })
    setNewTime(currentTime || "")
    setIsTimePickerOpen(true)
  }

  const handleSaveTime = () => {
    if (!selectedActivityForTime || !trip) return
    
    // Update local state
    const updatedStops = trip.stops.map(stop => {
      if (stop.id === selectedActivityForTime.stopId) {
        return {
          ...stop,
          activities: stop.activities.map(act => {
            if (act.id === selectedActivityForTime.activityId) {
              return { ...act, startTime: newTime || null }
            }
            return act
          })
        }
      }
      return stop
    })
    
    setTrip({ ...trip, stops: updatedStops })
    setIsTimePickerOpen(false)
    toast.success("Activity time updated")
  }

  const handleMoveActivity = (stopId: string, activityId: string, direction: 'up' | 'down') => {
    if (!trip) return
    
    const updatedStops = trip.stops.map(stop => {
      if (stop.id === stopId) {
        const activities = [...stop.activities]
        const index = activities.findIndex(a => a.id === activityId)
        
        if (direction === 'up' && index > 0) {
          [activities[index - 1], activities[index]] = [activities[index], activities[index - 1]]
        } else if (direction === 'down' && index < activities.length - 1) {
          [activities[index], activities[index + 1]] = [activities[index + 1], activities[index]]
        }
        
        return { ...stop, activities }
      }
      return stop
    })
    
    setTrip({ ...trip, stops: updatedStops })
  }

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const isDateInTrip = (date: Date): Stop | null => {
    if (!trip) return null
    for (const stop of trip.stops) {
      const arrival = new Date(stop.arrivalDate)
      const departure = new Date(stop.departureDate)
      arrival.setHours(0, 0, 0, 0)
      departure.setHours(23, 59, 59, 999)
      if (date >= arrival && date <= departure) {
        return stop
      }
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 min-h-screen">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full mb-8 rounded-2xl" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="container mx-auto py-20 text-center bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 min-h-screen">
        <Plane className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Trip not found</h1>
        <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-500">
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    )
  }

  const totalActivitiesCost = trip.stops.reduce((sum, stop) =>
    sum + stop.activities.reduce((actSum, act) => actSum + (act.activity.cost || 0), 0), 0
  )
  const totalExpenses = trip.expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const totalCost = totalActivitiesCost + totalExpenses

  return (
    <div className="container mx-auto py-8 px-4 pb-24 md:pb-8 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <Button variant="ghost" asChild className="mb-2 -ml-2 hover:bg-blue-50 hover:text-blue-600">
            <Link href="/trips">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Trips
            </Link>
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">{trip.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
            <Badge className={
              trip.status === 'completed' 
                ? 'bg-emerald-500 text-white' 
                : trip.status === 'ongoing'
                  ? 'bg-amber-500 text-white'
                  : 'bg-blue-500 text-white'
            }>
              {trip.status}
            </Badge>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-blue-500" />
              {trip.stops.length} {trip.stops.length === 1 ? 'city' : 'cities'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-cyan-500" />
              {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                <Share2 className="mr-2 h-4 w-4 text-blue-500" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Your Trip</DialogTitle>
                <DialogDescription>
                  Share this itinerary with friends or on social media
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/share/${trip.shareCode}`}
                    className="flex-1 px-3 py-2 text-sm border rounded-lg bg-muted"
                  />
                  <Button variant="outline" size="sm" onClick={copyShareLink}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => {
                    window.open(`https://twitter.com/intent/tweet?text=Check out my trip: ${trip.name}&url=${window.location.origin}/share/${trip.shareCode}`, '_blank')
                  }}>
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/share/${trip.shareCode}`, '_blank')
                  }}>
                    <Facebook className="mr-2 h-4 w-4" />
                    Facebook
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" asChild className="border-cyan-200 hover:bg-cyan-50">
            <Link href={`/trips/${trip.id}/budget`}>
              <PieChart className="mr-2 h-4 w-4 text-cyan-500" />
              Budget
            </Link>
          </Button>

          <Button variant="outline" asChild className="border-purple-200 hover:bg-purple-50">
            <Link href={`/trips/${trip.id}/itinerary`}>
              <Calendar className="mr-2 h-4 w-4 text-purple-500" />
              Full Itinerary
            </Link>
          </Button>

          <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
            <Link href={`/trips/${trip.id}/build`}>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Cover Image */}
      {trip.coverImage && (
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8 shadow-xl shadow-blue-500/10">
          <Image
            src={trip.coverImage}
            alt={trip.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-blue-500/10" />
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-medium text-gray-700">View:</span>
        <div className="flex gap-1 p-1 bg-white/80 rounded-lg border border-blue-100 shadow-sm">
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('timeline')}
            className={viewMode === 'timeline' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : 'hover:bg-blue-50'}
          >
            <Clock className="h-4 w-4 mr-1" />
            Timeline
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : 'hover:bg-blue-50'}
          >
            <List className="h-4 w-4 mr-1" />
            List
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('calendar')}
            className={viewMode === 'calendar' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : 'hover:bg-blue-50'}
          >
            <CalendarDays className="h-4 w-4 mr-1" />
            Calendar
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Itinerary View */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Timeline/Day-wise View - Organized by City and Day */}
          {viewMode === 'timeline' && (
            <>
              {daySchedule.length > 0 ? (
                daySchedule.map((day) => {
                  // Get the city for this day
                  const cityForDay = day.activities.length > 0 ? day.activities[0].city : null
                  
                  return (
                    <Card key={day.dateStr} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                      <div className="flex">
                        {/* Day Number Sidebar */}
                        <div className="w-20 md:w-24 bg-gradient-to-b from-blue-500 to-blue-600 flex flex-col items-center justify-center py-6 text-white">
                          <span className="text-3xl md:text-4xl font-bold">{day.dayNumber}</span>
                          <span className="text-sm text-blue-100">Day</span>
                        </div>
                        
                        {/* Main Content */}
                        <div className="flex-1">
                          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                              <h3 className="font-bold text-lg text-gray-800">
                                {cityForDay || 'Free Day'}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-gray-500 border-gray-300">
                              Transit
                            </Badge>
                          </div>
                          
                          <div className="p-4">
                            {day.activities.length > 0 ? (
                              <div className="space-y-3">
                                {day.activities.map((item, idx) => (
                                  <div
                                    key={`${item.stopActivity.id}-${idx}`}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all group"
                                  >
                                    {/* Activity Number */}
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                                      {idx + 1}
                                    </div>
                                    
                                    {/* Activity Details */}
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-800">{item.stopActivity.activity.name}</p>
                                      <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {item.stopActivity.activity.duration ? 
                                            `${Math.floor(item.stopActivity.activity.duration / 60)}h ${item.stopActivity.activity.duration % 60}m` : 
                                            '2h'
                                          }
                                        </span>
                                        {item.stopActivity.activity.category && (
                                          <Badge variant="secondary" className="text-xs">
                                            {item.stopActivity.activity.category}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    
                                    {/* Cost */}
                                    <div className="text-right">
                                      <span className="font-semibold text-emerald-600">
                                        ${item.stopActivity.activity.cost || 0}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 text-gray-400">
                                <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>No activities scheduled</p>
                                <Button variant="link" asChild className="text-blue-500">
                                  <Link href={`/trips/${trip.id}/build`}>Add activities</Link>
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })
              ) : (
                <Card className="border-dashed border-rose-200">
                  <CardContent className="py-12 text-center">
                    <Plane className="h-12 w-12 text-rose-200 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No stops added yet</p>
                    <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                      <Link href={`/trips/${trip.id}/build`}>Start Building Itinerary</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* List/Cities View */}
          {viewMode === 'list' && (
            <>
              {trip.stops.length > 0 ? (
                trip.stops.map((stop, stopIndex) => (
                  <Card key={stop.id} className="overflow-hidden border-blue-100/50 shadow-lg">
                    <div className="relative h-40">
                      <Image
                        src={stop.city.image || "/placeholder.svg"}
                        alt={stop.city.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-blue-500/10" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge className="mb-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">Stop {stopIndex + 1}</Badge>
                        <h3 className="text-2xl font-bold text-white">{stop.city.name}</h3>
                        <p className="text-white/80">{stop.city.country}</p>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-blue-400" />
                          {new Date(stop.arrivalDate).toLocaleDateString()} - {new Date(stop.departureDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-cyan-400" />
                          {stop.activities.length} activities
                        </span>
                      </div>

                      {stop.activities.length > 0 ? (
                        <div className="space-y-3">
                          {stop.activities.map((act, actIndex) => (
                            <div
                              key={act.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border border-blue-100"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-medium text-sm">
                                  {actIndex + 1}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">{act.activity.name}</p>
                                  {act.startTime && (
                                    <p className="text-xs text-gray-500">
                                      <Clock className="h-3 w-3 inline mr-1" />{act.startTime}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className="font-semibold text-emerald-600">
                                ${act.activity.cost?.toFixed(2) || '0.00'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-center py-4">No activities planned for this stop</p>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-dashed border-blue-200">
                  <CardContent className="py-12 text-center">
                    <Plane className="h-12 w-12 text-blue-200 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No stops added yet</p>
                    <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                      <Link href={`/trips/${trip.id}/build`}>Start Building Itinerary</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Calendar View */}
          {viewMode === 'calendar' && (
            <Card className="border-blue-100/50 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="icon" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    {monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
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
                  {Array.from({ length: getFirstDayOfMonth(calendarMonth) }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}
                  
                  {Array.from({ length: getDaysInMonth(calendarMonth) }).map((_, i) => {
                    const day = i + 1
                    const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
                    date.setHours(12, 0, 0, 0)
                    const stop = isDateInTrip(date)
                    const today = new Date()
                    const isToday = today.getDate() === day && today.getMonth() === calendarMonth.getMonth() && today.getFullYear() === calendarMonth.getFullYear()
                    
                    return (
                      <div
                        key={day}
                        className={`
                          aspect-square p-1 rounded-lg text-sm relative
                          ${stop ? 'bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-300' : 'hover:bg-gray-50'}
                          ${isToday ? 'ring-2 ring-blue-400' : ''}
                        `}
                      >
                        <span className={`
                          ${isToday ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white w-6 h-6 rounded-full flex items-center justify-center mx-auto' : ''}
                        `}>
                          {day}
                        </span>
                        {stop && (
                          <div className="absolute bottom-1 left-1 right-1">
                            <p className="text-[10px] text-blue-600 font-medium truncate text-center">
                              {stop.city.name}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-blue-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Trip Schedule</h4>
                  <div className="space-y-2">
                    {trip.stops.map((stop, idx) => (
                      <div key={stop.id} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                        <span className="text-gray-600">
                          {stop.city.name}: {new Date(stop.arrivalDate).toLocaleDateString()} - {new Date(stop.departureDate).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Budget Summary Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-xl shadow-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Budget Summary
              </CardTitle>
              <CardDescription className="text-white/80">
                Estimated trip expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">${totalCost.toFixed(2)}</div>
              <p className="text-sm text-white/70 mb-4">
                of ${trip.totalBudget.toLocaleString()} budget
              </p>
              <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                <div 
                  className="bg-white rounded-full h-2 transition-all"
                  style={{ width: `${Math.min((totalCost / trip.totalBudget) * 100, 100)}%` }}
                />
              </div>
              <Button
                variant="secondary"
                className="w-full bg-white text-blue-600 hover:bg-white/90"
                asChild
              >
                <Link href={`/trips/${trip.id}/budget`}>
                  View Full Breakdown
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-blue-100/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">Trip Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Cities</span>
                <span className="font-semibold text-gray-800">{trip.stops.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Activities</span>
                <span className="font-semibold text-gray-800">
                  {trip.stops.reduce((sum, s) => sum + s.activities.length, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Duration</span>
                <span className="font-semibold text-gray-800">
                  {Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Avg. per day</span>
                <span className="font-semibold text-emerald-600">
                  ${(totalCost / Math.max(1, Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)).toFixed(0)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Share Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Share2 className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-gray-800">Share this trip</span>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                Let others see your amazing travel plans
              </p>
              <Button variant="outline" className="w-full border-blue-200 hover:bg-white" onClick={copyShareLink}>
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-emerald-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <LinkIcon className="mr-2 h-4 w-4 text-blue-500" />
                    Copy Share Link
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Time Picker Dialog */}
      <Dialog open={isTimePickerOpen} onOpenChange={setIsTimePickerOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Set Activity Time
            </DialogTitle>
            <DialogDescription>
              Choose a time for this activity
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="text-center text-lg"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setNewTime(""); handleSaveTime(); }}>
              Clear Time
            </Button>
            <Button 
              onClick={handleSaveTime}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
            >
              Save Time
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
