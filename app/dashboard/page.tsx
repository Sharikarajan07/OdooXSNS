"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { popularDestinations, mockTrips } from "@/lib/mock-data"
import { Plus, MapPin, Calendar, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section */}
      <section className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-12 shadow-md">
        <div className="absolute inset-0 bg-primary/40 z-10" />
        <div className="absolute inset-0">
          <Image src="/beautiful-travel-destination-landscape.jpg" alt="Travel Hero" fill className="object-cover" priority />
        </div>
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white p-6">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">Where to next?</h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl drop-shadow-md">
            Plan your personalized itinerary and track your budget for the ultimate travel experience.
          </p>
          <Button size="lg" asChild className="rounded-full px-8 shadow-lg">
            <Link href="/trips/new">
              <Plus className="mr-2 h-5 w-5" />
              Plan a New Trip
            </Link>
          </Button>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Previous Trips Section */}
        <div className="md:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">My Recent Trips</h2>
            <Link href="/trips" className="text-sm text-primary hover:underline font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {mockTrips.slice(0, 3).map((trip) => (
              <Card key={trip.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{trip.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {trip.destination}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {new Date(trip.startDate).toLocaleDateString()}
                  </span>
                  <Button variant="ghost" size="sm" asChild className="text-primary p-0 h-auto">
                    <Link href={`/trips/${trip.id}`}>
                      Details <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular Destinations Section */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Popular Destinations</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {popularDestinations.map((dest) => (
              <Card key={dest.id} className="group overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={dest.image || "/placeholder.svg"}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white font-bold text-xl">{dest.name}</h3>
                    <p className="text-white/80 text-sm">{dest.country}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{dest.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Explore
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
