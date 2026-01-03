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
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="relative h-40">
          <Image
            src={trip.coverImage || "/placeholder.svg"}
            alt={trip.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <div className="absolute top-3 left-3">
            <Badge
              variant={trip.status === 'upcoming' ? 'default' : trip.status === 'ongoing' ? 'secondary' : 'outline'}
              className={trip.status === 'completed' ? 'bg-green-500/90 text-white' : ''}
            >
              {trip.status}
            </Badge>
          </div>

          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={(e) => {
                e.preventDefault()
                router.push(`/trips/${trip.id}/build`)
              }}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="h-8 w-8"
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

        <CardFooter className="p-4 flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
            </span>
            <span className="text-sm font-medium flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-green-600" />
              ${trip.totalBudget?.toLocaleString() || 0} budget
            </span>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-primary">
            <Link href={`/trips/${trip.id}`}>
              View <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  const EmptyState = ({ status }: { status: string }) => (
    <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl">
      <Plane className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
      <p className="text-muted-foreground mb-4">
        No {status} trips {status === 'upcoming' ? 'planned' : ''}.
      </p>
      {status === 'upcoming' && (
        <Button asChild>
          <Link href="/trips/new">
            <Plus className="mr-2 h-4 w-4" />
            Start Planning
          </Link>
        </Button>
      )}
    </div>
  )

  return (
    <div className="container mx-auto py-8 px-4 pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Trips</h1>
          <p className="text-muted-foreground">Manage all your past and future adventures.</p>
        </div>
        <Button asChild size="lg">
          <Link href="/trips/new">
            <Plus className="mr-2 h-4 w-4" />
            New Trip
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-8 w-full md:w-auto overflow-x-auto">
          <TabsTrigger value="ongoing" className="px-6">
            Ongoing ({ongoing.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="px-6">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="px-6">
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
