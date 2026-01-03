"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Plus,
    MapPin,
    Calendar,
    ArrowRight,
    DollarSign,
    Plane,
    TrendingUp,
    Star,
    Clock,
    Globe
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

interface City {
    id: string
    name: string
    country: string
    region: string
    image: string
    description: string
    costIndex: number
    popularity: number
}

interface Activity {
    id: string
    name: string
    category: string
    cost: number
    duration: number
    image: string
    city?: { name: string }
}

export default function DashboardPage() {
    const [trips, setTrips] = useState<Trip[]>([])
    const [cities, setCities] = useState<City[]>([])
    const [activities, setActivities] = useState<Activity[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [tripsRes, citiesRes, activitiesRes] = await Promise.all([
                fetch('/api/trips'),
                fetch('/api/cities?sortBy=popularity'),
                fetch('/api/activities?sortBy=rating'),
            ])

            const tripsData = await tripsRes.json()
            const citiesData = await citiesRes.json()
            const activitiesData = await activitiesRes.json()

            setTrips(tripsData.trips || [])
            setCities(citiesData.cities || [])
            setActivities(activitiesData.activities || [])
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        }
        setIsLoading(false)
    }

    const upcomingTrips = trips.filter(t => t.status === 'upcoming').slice(0, 3)
    const totalBudget = trips.reduce((sum, t) => sum + (t.totalBudget || 0), 0)

    return (
        <div className="container mx-auto py-8 px-4 pb-24 md:pb-8">
            {/* Hero Section */}
            <section className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60 z-10" />
                <div className="absolute inset-0 bg-[url('/beautiful-travel-destination-landscape.jpg')] bg-cover bg-center" />
                <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white p-6">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                        Where to next? ✈️
                    </h1>
                    <p className="text-lg md:text-xl mb-6 max-w-2xl drop-shadow-md opacity-90">
                        Plan your personalized itinerary and track your budget for the ultimate travel experience.
                    </p>
                    <Button size="lg" asChild className="rounded-full px-8 shadow-lg bg-white text-primary hover:bg-white/90">
                        <Link href="/trips/new">
                            <Plus className="mr-2 h-5 w-5" />
                            Plan a New Trip
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <Plane className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{trips.length}</p>
                                <p className="text-sm text-muted-foreground">Total Trips</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                                <DollarSign className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Total Budget</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500/20 rounded-lg">
                                <MapPin className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{cities.length}</p>
                                <p className="text-sm text-muted-foreground">Destinations</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{upcomingTrips.length}</p>
                                <p className="text-sm text-muted-foreground">Upcoming</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* My Recent Trips */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-foreground">My Trips</h2>
                        <Link href="/trips" className="text-sm text-primary hover:underline font-medium">
                            View all
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="p-4">
                                        <Skeleton className="h-4 w-3/4 mb-2" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : trips.length > 0 ? (
                        <div className="space-y-4">
                            {trips.slice(0, 4).map((trip) => (
                                <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                                    <div className="flex">
                                        <div className="w-24 h-24 relative shrink-0 bg-muted">
                                            {trip.coverImage && (
                                                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${trip.coverImage})` }} />
                                            )}
                                        </div>
                                        <div className="flex-1 p-3">
                                            <div className="flex items-start justify-between mb-1">
                                                <CardTitle className="text-base line-clamp-1">{trip.name}</CardTitle>
                                                <Badge
                                                    variant={trip.status === 'upcoming' ? 'default' : 'secondary'}
                                                    className="text-[10px] shrink-0"
                                                >
                                                    {trip.status}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(trip.startDate).toLocaleDateString()}
                                            </p>
                                            <Link
                                                href={`/trips/${trip.id}`}
                                                className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                                            >
                                                View Details <ArrowRight className="h-3 w-3" />
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="py-8 text-center">
                                <Plane className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                                <p className="text-muted-foreground mb-4">No trips yet</p>
                                <Button asChild size="sm">
                                    <Link href="/trips/new">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Your First Trip
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Top Regional Selections */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Globe className="h-6 w-6 text-primary" />
                            Top Destinations
                        </h2>
                        <Link href="/search/cities" className="text-sm text-primary hover:underline font-medium">
                            See all
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <Card key={i}>
                                    <Skeleton className="h-48 w-full" />
                                    <CardContent className="p-4">
                                        <Skeleton className="h-5 w-3/4 mb-2" />
                                        <Skeleton className="h-4 w-full" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {cities.slice(0, 4).map((city) => (
                                <Card key={city.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                                    <div className="relative h-48 bg-muted">
                                        {city.image && (
                                            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: `url(${city.image})` }} />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                        <div className="absolute top-3 right-3">
                                            <Badge className="bg-white/90 text-foreground">
                                                <TrendingUp className="h-3 w-3 mr-1" />
                                                {city.popularity}%
                                            </Badge>
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h3 className="text-white font-bold text-xl mb-1">{city.name}</h3>
                                            <p className="text-white/80 text-sm flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {city.country}
                                            </p>
                                        </div>
                                    </div>
                                    <CardContent className="p-4">
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{city.description}</p>
                                        <div className="flex items-center justify-between">
                                            <Badge variant="outline" className="text-xs">
                                                <DollarSign className="h-3 w-3 mr-1" />
                                                {city.costIndex < 40 ? 'Budget' : city.costIndex < 70 ? 'Moderate' : 'Expensive'}
                                            </Badge>
                                            <Button variant="ghost" size="sm" asChild className="text-primary">
                                                <Link href={`/search/cities`}>
                                                    Explore <ArrowRight className="ml-1 h-3 w-3" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Suggestions Section */}
            <section className="mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Star className="h-6 w-6 text-yellow-500" />
                        Suggested Activities
                    </h2>
                    <Link href="/search" className="text-sm text-primary hover:underline font-medium">
                        Browse all
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i}>
                                <Skeleton className="h-32 w-full" />
                                <CardContent className="p-4">
                                    <Skeleton className="h-4 w-3/4 mb-2" />
                                    <Skeleton className="h-3 w-1/2" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {activities.slice(0, 4).map((activity) => (
                            <Card key={activity.id} className="group overflow-hidden hover:shadow-lg transition-all">
                                <div className="relative h-32 bg-muted">
                                    {activity.image && (
                                        <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300" style={{ backgroundImage: `url(${activity.image})` }} />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <Badge className="absolute top-2 left-2 bg-white/90 text-foreground text-[10px]">
                                        {activity.category}
                                    </Badge>
                                </div>
                                <CardContent className="p-3">
                                    <h4 className="font-semibold text-sm line-clamp-1 mb-1">{activity.name}</h4>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <DollarSign className="h-3 w-3" />
                                            {activity.cost}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {Math.floor(activity.duration / 60)}h
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
