"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Plane
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Activity {
  id: string
  name: string
  cost: number
  category?: string
}

interface StopActivity {
  activity: Activity
  startTime?: string
  orderIndex: number
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

export default function TripDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'timeline' | 'list' | 'calendar'>('timeline')
  const [copied, setCopied] = useState(false)

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

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
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
      <div className="container mx-auto py-20 text-center">
        <Plane className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Trip not found</h1>
        <Button asChild>
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
    <div className="container mx-auto py-8 px-4 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <Button variant="ghost" asChild className="mb-2 -ml-2">
            <Link href="/trips">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Trips
            </Link>
          </Button>
          <h1 className="text-4xl font-bold text-foreground">{trip.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
            <Badge variant={trip.status === 'completed' ? 'default' : 'secondary'}>
              {trip.status}
            </Badge>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {trip.stops.length} {trip.stops.length === 1 ? 'city' : 'cities'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
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

          <Button variant="outline" asChild>
            <Link href={`/trips/${trip.id}/budget`}>
              <PieChart className="mr-2 h-4 w-4" />
              Budget
            </Link>
          </Button>

          <Button asChild>
            <Link href={`/trips/${trip.id}/build`}>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Cover Image */}
      {trip.coverImage && (
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8 shadow-lg">
          <Image
            src={trip.coverImage}
            alt={trip.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-medium">View:</span>
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('timeline')}
          >
            <Clock className="h-4 w-4 mr-1" />
            Timeline
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4 mr-1" />
            List
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('calendar')}
          >
            <CalendarDays className="h-4 w-4 mr-1" />
            Calendar
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Itinerary View */}
        <div className="lg:col-span-2 space-y-6">
          {trip.stops.length > 0 ? (
            trip.stops.map((stop, stopIndex) => (
              <Card key={stop.id} className="overflow-hidden">
                <div className="relative h-40">
                  <Image
                    src={stop.city.image || "/placeholder.svg"}
                    alt={stop.city.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge variant="secondary" className="mb-2">Stop {stopIndex + 1}</Badge>
                    <h3 className="text-2xl font-bold text-white">{stop.city.name}</h3>
                    <p className="text-white/80">{stop.city.country}</p>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(stop.arrivalDate).toLocaleDateString()} - {new Date(stop.departureDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {stop.activities.length} activities
                    </span>
                  </div>

                  {stop.activities.length > 0 ? (
                    <div className="space-y-3">
                      {stop.activities.map((act, actIndex) => (
                        <div
                          key={act.activity.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                              {actIndex + 1}
                            </div>
                            <div>
                              <p className="font-medium">{act.activity.name}</p>
                              {act.activity.category && (
                                <p className="text-xs text-muted-foreground">{act.activity.category}</p>
                              )}
                            </div>
                          </div>
                          <span className="font-semibold text-green-600">
                            ${act.activity.cost?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No activities planned for this stop
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Plane className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No stops added yet</p>
                <Button asChild>
                  <Link href={`/trips/${trip.id}/build`}>
                    Start Building Itinerary
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Budget Summary Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Budget Summary
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Estimated trip expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">${totalCost.toFixed(2)}</div>
              <p className="text-sm text-primary-foreground/70 mb-4">
                of ${trip.totalBudget.toLocaleString()} budget
              </p>
              <Button
                variant="secondary"
                className="w-full"
                asChild
              >
                <Link href={`/trips/${trip.id}/budget`}>
                  View Full Breakdown
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trip Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cities</span>
                <span className="font-semibold">{trip.stops.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Activities</span>
                <span className="font-semibold">
                  {trip.stops.reduce((sum, s) => sum + s.activities.length, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-semibold">
                  {Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg. per day</span>
                <span className="font-semibold">
                  ${(totalCost / Math.max(1, Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)))).toFixed(0)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Share Card */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Share2 className="h-5 w-5 text-primary" />
                <span className="font-medium">Share this trip</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Let others see your amazing travel plans
              </p>
              <Button variant="outline" className="w-full" onClick={copyShareLink}>
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Copy Share Link
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
