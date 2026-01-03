"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  MapPin,
  Calendar,
  ArrowRight,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  Plane
} from "lucide-react"
import Image from "next/image"

interface Trip {
  id: string
  name: string
  description: string
  coverImage: string
  startDate: string
  endDate: string
  status: string
  totalBudget: number
  stops?: Array<{ city: { name: string } }>
}

export default function TripsListingPage() {
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

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

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const res = await fetch(`/api/trips/${deleteId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setTrips(trips.filter(t => t.id !== deleteId))
      }
    } catch (error) {
      console.error('Error deleting trip:', error)
    }
    setDeleteId(null)
  }

  const ongoing = trips.filter((t) => t.status === "ongoing")
  const upcoming = trips.filter((t) => t.status === "upcoming")
  const completed = trips.filter((t) => t.status === "completed")

  const TripCard = ({ trip }: { trip: Trip }) => {
    const destinationCount = trip.stops?.length || 0

    return (
      <Card className="group overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 border-blue-100/50 hover:-translate-y-1">
        <div className="relative h-44">
          <Image
            src={trip.coverImage || "/placeholder.svg"}
            alt={trip.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-blue-500/10" />

          <div className="absolute top-3 left-3">
            <Badge
              className={
                trip.status === 'upcoming' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg shadow-blue-500/30' 
                  : trip.status === 'ongoing' 
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg shadow-amber-500/30' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg shadow-emerald-500/30'
              }
            >
              {trip.status}
            </Badge>
          </div>

          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            <Button
              size="icon"
              className="h-8 w-8 bg-white/90 hover:bg-white text-gray-700 hover:text-blue-600 shadow-lg"
              onClick={(e) => {
                e.preventDefault()
                router.push(`/trips/${trip.id}/build`)
              }}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="h-8 w-8 bg-red-500 hover:bg-red-600 text-white shadow-lg"
              onClick={(e) => {
                e.preventDefault()
                setDeleteId(trip.id)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <CardTitle className="text-white text-lg mb-1 line-clamp-1">{trip.name}</CardTitle>
            <CardDescription className="text-white/80 flex items-center gap-1 text-sm">
              <MapPin className="h-3 w-3" />
              {destinationCount} {destinationCount === 1 ? 'destination' : 'destinations'}
            </CardDescription>
          </div>
        </div>

        <CardFooter className="p-4 flex justify-between items-center bg-gradient-to-r from-white to-blue-50/50">
          <div className="space-y-1">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-blue-400" />
              {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
            </span>
            <span className="text-sm font-semibold flex items-center gap-1 text-gray-700">
              <DollarSign className="h-3 w-3 text-emerald-500" />
              ${trip.totalBudget?.toLocaleString() || 0} budget
            </span>
          </div>
          <Button size="sm" asChild className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all duration-300">
            <Link href={`/trips/${trip.id}`}>
              View <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  const EmptyState = ({ status }: { status: string }) => (
    <div className="col-span-full py-20 text-center border-2 border-dashed border-blue-200 rounded-xl bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
      <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
        <Plane className="h-8 w-8 text-blue-400" />
      </div>
      <p className="text-gray-500 mb-4">
        No {status} trips {status === 'upcoming' ? 'planned' : ''}.
      </p>
      {status === 'upcoming' && (
        <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30">
          <Link href="/trips/new">
            <Plus className="mr-2 h-4 w-4" />
            Start Planning
          </Link>
        </Button>
      )}
    </div>
  )

  return (
    <div className="container mx-auto py-8 px-4 pb-24 md:pb-8 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">My Trips</h1>
          <p className="text-gray-500">Manage all your past and future adventures.</p>
        </div>
        <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300">
          <Link href="/trips/new">
            <Plus className="mr-2 h-4 w-4" />
            New Trip
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-8 w-full md:w-auto overflow-x-auto bg-white/80 border border-blue-100">
          <TabsTrigger value="ongoing" className="px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
            Ongoing ({ongoing.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
            Completed ({completed.length})
          </TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-40 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="ongoing" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ongoing.length > 0 ? (
                ongoing.map((trip) => <TripCard key={trip.id} trip={trip} />)
              ) : (
                <EmptyState status="ongoing" />
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.length > 0 ? (
                upcoming.map((trip) => <TripCard key={trip.id} trip={trip} />)
              ) : (
                <EmptyState status="upcoming" />
              )}
            </TabsContent>

            <TabsContent value="completed" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {completed.length > 0 ? (
                completed.map((trip) => <TripCard key={trip.id} trip={trip} />)
              ) : (
                <EmptyState status="completed" />
              )}
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this trip? This action cannot be undone.
              All activities and expenses associated with this trip will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
