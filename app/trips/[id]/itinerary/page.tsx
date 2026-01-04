"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Edit2,
  Share2,
  Download,
  Printer,
  CheckCircle2,
  Plane,
  ChevronRight,
  Star,
  Check,
  Copy
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Activity {
  id: string
  name: string
  cost: number
  category: string
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
  shareCode?: string
  stops: Stop[]
}

export default function ItineraryViewPage() {
  const params = useParams()
  const tripId = params.id as string

  const [trip, setTrip] = useState<Trip | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([0, 1, 2]))
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchTrip()
  }, [tripId])

  const copyShareLink = () => {
    if (trip?.shareCode) {
      const shareUrl = `${window.location.origin}/share/${trip.shareCode}`
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const fetchTrip = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/trips/${tripId}`)
      const data = await res.json()
      
      if (data.trip) {
        setTrip(data.trip)
      } else {
        // Create mock trip data if none exists
        setTrip({
          id: tripId,
          name: "European Adventure 2026",
          description: "A magical journey through Europe's most iconic destinations",
          coverImage: "/paris-eiffel-tower.png",
          startDate: "2026-06-15",
          endDate: "2026-06-30",
          status: "upcoming",
          totalBudget: 8500,
          stops: [
            {
              id: "stop-1",
              city: { name: "Paris", country: "France", image: "/paris-eiffel-tower.png" },
              arrivalDate: "2026-06-15",
              departureDate: "2026-06-20",
              orderIndex: 0,
              activities: [
                { id: "a1", activity: { id: "act1", name: "Eiffel Tower Visit", cost: 28, category: "Culture", duration: 180 }, orderIndex: 0, dayIndex: 0 },
                { id: "a2", activity: { id: "act2", name: "Louvre Museum Tour", cost: 45, category: "Culture", duration: 240 }, orderIndex: 1, dayIndex: 0 },
                { id: "a3", activity: { id: "act3", name: "Seine River Cruise", cost: 35, category: "Relaxation", duration: 90 }, orderIndex: 0, dayIndex: 1 },
                { id: "a4", activity: { id: "act4", name: "Notre-Dame Cathedral", cost: 0, category: "Culture", duration: 60 }, orderIndex: 1, dayIndex: 1 },
                { id: "a5", activity: { id: "act5", name: "Montmartre Walking Tour", cost: 25, category: "Adventure", duration: 120 }, orderIndex: 0, dayIndex: 2 },
              ]
            },
            {
              id: "stop-2",
              city: { name: "Rome", country: "Italy", image: "/amalfi-coast.jpg" },
              arrivalDate: "2026-06-20",
              departureDate: "2026-06-25",
              orderIndex: 1,
              activities: [
                { id: "b1", activity: { id: "bct1", name: "Colosseum Guided Tour", cost: 55, category: "Culture", duration: 180 }, orderIndex: 0, dayIndex: 0 },
                { id: "b2", activity: { id: "bct2", name: "Vatican Museums & Sistine Chapel", cost: 45, category: "Culture", duration: 300 }, orderIndex: 0, dayIndex: 1 },
                { id: "b3", activity: { id: "bct3", name: "Trevi Fountain & Spanish Steps", cost: 0, category: "Culture", duration: 90 }, orderIndex: 0, dayIndex: 2 },
                { id: "b4", activity: { id: "bct4", name: "Italian Cooking Class", cost: 85, category: "Food", duration: 180 }, orderIndex: 0, dayIndex: 3 },
              ]
            },
            {
              id: "stop-3",
              city: { name: "Barcelona", country: "Spain", image: "/beautiful-travel-destination-landscape.jpg" },
              arrivalDate: "2026-06-25",
              departureDate: "2026-06-30",
              orderIndex: 2,
              activities: [
                { id: "c1", activity: { id: "cct1", name: "Sagrada Familia Tour", cost: 40, category: "Culture", duration: 150 }, orderIndex: 0, dayIndex: 0 },
                { id: "c2", activity: { id: "cct2", name: "Park Güell Exploration", cost: 15, category: "Nature", duration: 120 }, orderIndex: 0, dayIndex: 1 },
                { id: "c3", activity: { id: "cct3", name: "Las Ramblas Food Tour", cost: 65, category: "Food", duration: 180 }, orderIndex: 0, dayIndex: 2 },
                { id: "c4", activity: { id: "cct4", name: "Beach Day at Barceloneta", cost: 0, category: "Relaxation", duration: 240 }, orderIndex: 0, dayIndex: 3 },
              ]
            }
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
    }
    setIsLoading(false)
  }

  const toggleDay = (dayIndex: number) => {
    const newExpanded = new Set(expandedDays)
    if (newExpanded.has(dayIndex)) {
      newExpanded.delete(dayIndex)
    } else {
      newExpanded.add(dayIndex)
    }
    setExpandedDays(newExpanded)
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

  // Generate day-by-day itinerary
  const generateDaySchedule = (): Array<{ date: Date; stop: Stop; dayNumber: number; isFirstDayAtStop: boolean; isLastDayAtStop: boolean; dayActivities: StopActivity[] }> => {
    if (!trip) return []
    
    const schedule: Array<{ date: Date; stop: Stop; dayNumber: number; isFirstDayAtStop: boolean; isLastDayAtStop: boolean; dayActivities: StopActivity[] }> = []
    const tripStart = parseLocalDate(trip.startDate)
    const tripEnd = parseLocalDate(trip.endDate)
    let dayNumber = 1
    
    const currentDate = new Date(tripStart)
    while (currentDate <= tripEnd) {
      const currentDateStr = toDateString(currentDate)
      
      const stop = trip.stops.find(s => {
        const arrivalStr = toDateString(s.arrivalDate)
        const departureStr = toDateString(s.departureDate)
        return currentDateStr >= arrivalStr && currentDateStr <= departureStr
      })
      
      if (stop) {
        const arrivalStr = toDateString(stop.arrivalDate)
        const departureStr = toDateString(stop.departureDate)
        
        // Calculate which day within the stop this is (0-indexed)
        const arrivalDate = parseLocalDate(arrivalStr)
        const dayWithinStop = Math.round((currentDate.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24))
        
        // Filter activities for this specific day within the stop
        const dayActivities = stop.activities.filter(act => {
          const activityDayIndex = act.dayIndex ?? 0
          return activityDayIndex === dayWithinStop
        })
        
        schedule.push({
          date: new Date(currentDate),
          stop,
          dayNumber,
          isFirstDayAtStop: currentDateStr === arrivalStr,
          isLastDayAtStop: currentDateStr === departureStr,
          dayActivities
        })
      }
      dayNumber++
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return schedule
  }

  const totalCost = trip?.stops.reduce((sum, stop) => 
    sum + stop.activities.reduce((actSum, act) => actSum + act.activity.cost, 0), 0
  ) || 0

  const totalActivities = trip?.stops.reduce((sum, stop) => sum + stop.activities.length, 0) || 0

  const daySchedule = generateDaySchedule()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30">
        <div className="container mx-auto py-8 px-4">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-64 mb-4" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Plane className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Trip Not Found</h2>
            <Button asChild className="mt-4">
              <Link href="/trips">Back to Trips</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 pb-24 md:pb-8">
      {/* Hero Header */}
      <div className="relative h-64 md:h-80">
        <Image
          src={trip.coverImage || "/placeholder.svg"}
          alt={trip.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <Button variant="secondary" size="sm" asChild className="bg-white/90 hover:bg-white">
            <Link href={`/trips/${tripId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white" asChild>
              <Link href={`/trips/${tripId}/build`}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white/90 hover:bg-white"
              onClick={() => {
                copyShareLink()
                toast.success("Share link copied to clipboard!")
              }}
            >
              {copied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Share2 className="mr-2 h-4 w-4" />}
              {copied ? "Copied!" : "Share"}
            </Button>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <Badge className="mb-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
            Complete Itinerary
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{trip.name}</h1>
          <p className="text-white/80 max-w-2xl">{trip.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur border-blue-100">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-bold">{daySchedule.length} Days</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-blue-100">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Destinations</p>
                <p className="font-bold">{trip.stops.length} Cities</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-blue-100">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Activities</p>
                <p className="font-bold">{totalActivities} Planned</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-blue-100">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Est. Cost</p>
                <p className="font-bold text-emerald-600">${totalCost}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Route Overview */}
        <Card className="mb-8 border-blue-100 bg-white/80 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plane className="h-5 w-5 text-blue-500" />
              Your Route
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center flex-wrap gap-2">
              {trip.stops.map((stop, index) => (
                <div key={stop.id} className="flex items-center">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full border border-blue-200">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{stop.city.name}</span>
                    <span className="text-xs text-muted-foreground">({stop.city.country})</span>
                  </div>
                  {index < trip.stops.length - 1 && (
                    <ChevronRight className="h-5 w-5 text-blue-300 mx-1" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Day-by-Day Itinerary */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-500" />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Day-by-Day Schedule
            </span>
          </h2>

          {daySchedule.map((day, index) => (
            <Card 
              key={index} 
              className={`border-blue-100 overflow-hidden transition-all duration-300 ${
                expandedDays.has(index) ? 'bg-white' : 'bg-white/80'
              }`}
            >
              <button
                className="w-full"
                onClick={() => toggleDay(index)}
              >
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex flex-col items-center justify-center text-white">
                        <span className="text-xs font-medium">Day</span>
                        <span className="text-xl font-bold">{day.dayNumber}</span>
                      </div>
                      <div className="text-left">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          {day.stop.city.name}, {day.stop.city.country}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3" />
                          {day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                          {day.isFirstDayAtStop && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">Arrival</Badge>
                          )}
                          {day.isLastDayAtStop && (
                            <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">Departure</Badge>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm text-muted-foreground">{day.dayActivities.length} activities</p>
                        <p className="font-semibold text-emerald-600">
                          ${day.dayActivities.reduce((sum, a) => sum + a.activity.cost, 0)}
                        </p>
                      </div>
                      <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${
                        expandedDays.has(index) ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </div>
                </CardHeader>
              </button>

              {expandedDays.has(index) && (
                <CardContent className="p-4">
                  {day.dayActivities.length > 0 ? (
                    <div className="space-y-3">
                      {day.dayActivities.map((act, actIndex) => (
                        <div
                          key={act.id}
                          className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border border-blue-100 hover:shadow-md transition-shadow"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {actIndex + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-gray-800">{act.activity.name}</h4>
                              <Badge variant="secondary" className="text-xs">{act.activity.category}</Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              {act.activity.duration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {Math.floor(act.activity.duration / 60)}h {act.activity.duration % 60}m
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-bold text-emerald-600 text-lg">
                              {act.activity.cost === 0 ? 'Free' : `$${act.activity.cost}`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No activities planned for this day</p>
                      <Button variant="outline" size="sm" className="mt-2" asChild>
                        <Link href={`/trips/${tripId}/build`}>
                          Add Activities
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
            <Link href={`/trips/${tripId}/build`}>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Itinerary
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className="border-blue-200 hover:bg-blue-50"
            onClick={() => {
              copyShareLink()
              toast.success("Share link copied to clipboard!")
            }}
          >
            {copied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Share2 className="mr-2 h-4 w-4" />}
            {copied ? "Link Copied!" : "Share Trip"}
          </Button>
          <Button variant="outline" className="border-blue-200 hover:bg-blue-50" asChild>
            <Link href={`/trips/${tripId}/budget`}>
              <DollarSign className="mr-2 h-4 w-4" />
              View Budget
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
