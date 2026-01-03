"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTrip, type Trip } from "@/context/trip-context"
import { mockTrips } from "@/lib/mock-data"
import { MapPin, Calendar, ArrowRight, Plus } from "lucide-react"

export default function TripsListingPage() {
  const { trips } = useTrip()

  // Combine context trips with mock trips for the listing demo
  const allTrips = [...trips, ...mockTrips]

  const ongoing = allTrips.filter((t) => t.status === "ongoing")
  const upcoming = allTrips.filter((t) => t.status === "upcoming")
  const completed = allTrips.filter((t) => t.status === "completed")

  const TripCard = ({ trip }: { trip: Trip }) => (
    <Card key={trip.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{trip.name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {trip.destination}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" /> {new Date(trip.startDate).toLocaleDateString()}
        </span>
        <Button variant="ghost" size="sm" asChild className="text-primary">
          <Link href={`/trips/${trip.id}`}>
            View Itinerary <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Trips</h1>
          <p className="text-muted-foreground">Manage all your past and future adventures.</p>
        </div>
        <Button asChild>
          <Link href="/trips/new">
            <Plus className="mr-2 h-4 w-4" />
            New Trip
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-8 w-full md:w-auto overflow-x-auto">
          <TabsTrigger value="ongoing" className="px-8">
            Ongoing ({ongoing.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="px-8">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="px-8">
            Completed ({completed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ongoing" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ongoing.length > 0 ? (
            ongoing.map((trip) => <TripCard key={trip.id} trip={trip} />)
          ) : (
            <p className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              No ongoing trips at the moment.
            </p>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upcoming.length > 0 ? (
            upcoming.map((trip) => <TripCard key={trip.id} trip={trip} />)
          ) : (
            <p className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              No upcoming trips planned.{" "}
              <Link href="/trips/new" className="text-primary hover:underline">
                Start planning!
              </Link>
            </p>
          )}
        </TabsContent>

        <TabsContent value="completed" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {completed.length > 0 ? (
            completed.map((trip) => <TripCard key={trip.id} trip={trip} />)
          ) : (
            <p className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              No completed trips yet.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
