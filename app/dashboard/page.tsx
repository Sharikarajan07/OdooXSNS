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
            {/* Hero Section - Stunning Travel Destination */}
            <section className="relative h-80 md:h-[420px] rounded-3xl overflow-hidden mb-8 shadow-2xl">
                {/* Background Image - Beautiful Santorini sunset view */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&q=80')] bg-cover bg-center" />
                
                {/* Warm overlay gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-800/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                
                {/* Content */}
                <div className="relative z-20 h-full flex flex-col justify-center p-8 md:p-12">
                    {/* Trust badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-sm mb-6 w-fit border border-white/20">
                        <Globe className="h-4 w-4" />
                        <span>Trusted by 500,000+ travelers worldwide</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Your Journey Starts Here</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl drop-shadow-md">
                        Plan unforgettable trips with personalized itineraries, local insights, and seamless collaboration tools.
                    </p>
                    
                    <div className="flex flex-wrap gap-4 mb-8">
                        <Button size="lg" asChild className="rounded-full px-8 py-6 shadow-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold text-lg transition-transform hover:scale-105">
                            <Link href="/trips/new">
                                <Plus className="mr-2 h-5 w-5" />
                                Plan New Trip
                            </Link>
                        </Button>
                    </div>
                </div>
                
                {/* Stats badges - bottom right */}
                <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 flex items-center gap-3 z-20">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
                        <p className="text-2xl font-bold text-white">190+</p>
                        <p className="text-xs text-white/70">Countries</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
                        <p className="text-2xl font-bold text-white">50K+</p>
                        <p className="text-xs text-white/70">Destinations</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20 flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                        <div>
                            <p className="text-2xl font-bold text-white">4.9</p>
                            <p className="text-xs text-white/70">Rating</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Stats with Blue Gradient Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card className="bg-gradient-to-br from-cyan-500 to-blue-600 border-0 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Plane className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{trips.length}</p>
                                <p className="text-sm text-white/80">Total Trips</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-500 to-teal-500 border-0 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <DollarSign className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
                                <p className="text-sm text-white/80">Total Budget</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 border-0 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <MapPin className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{cities.length}</p>
                                <p className="text-sm text-white/80">Destinations</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 border-0 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <TrendingUp className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{upcomingTrips.length}</p>
                                <p className="text-sm text-white/80">Upcoming</p>
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
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/25">
                                <Globe className="h-5 w-5 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Top Destinations</span>
                        </h2>
                        <Link href="/search/cities" className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1 hover:gap-2 transition-all duration-300">
                            See all <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <Card key={i} className="border-blue-100">
                                    <Skeleton className="h-48 w-full bg-blue-50" />
                                    <CardContent className="p-4">
                                        <Skeleton className="h-5 w-3/4 mb-2 bg-blue-50" />
                                        <Skeleton className="h-4 w-full bg-blue-50" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {cities.slice(0, 4).map((city) => (
                                <Card key={city.id} className="group overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 border-blue-100/50 hover:-translate-y-1">
                                    <div className="relative h-52 bg-blue-50">
                                        {city.image && (
                                            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url(${city.image})` }} />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-blue-500/10" />

                                        <div className="absolute top-3 right-3">
                                            <Badge className="bg-white/95 text-gray-700 border-0 shadow-lg">
                                                <TrendingUp className="h-3 w-3 mr-1 text-blue-500" />
                                                {city.popularity}%
                                            </Badge>
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h3 className="text-white font-bold text-xl mb-1 drop-shadow-lg">{city.name}</h3>
                                            <p className="text-white/90 text-sm flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {city.country}
                                            </p>
                                        </div>
                                    </div>
                                    <CardContent className="p-4 bg-gradient-to-r from-white to-blue-50/30">
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{city.description}</p>
                                        <div className="flex items-center justify-between">
                                            <Badge className={`text-xs border-0 ${
                                                city.costIndex < 40 
                                                    ? 'bg-emerald-100 text-emerald-700' 
                                                    : city.costIndex < 70 
                                                        ? 'bg-amber-100 text-amber-700' 
                                                        : 'bg-purple-100 text-purple-700'
                                            }`}>
                                                <DollarSign className="h-3 w-3 mr-1" />
                                                {city.costIndex < 40 ? 'Budget' : city.costIndex < 70 ? 'Moderate' : 'Premium'}
                                            </Badge>
                                            <Button size="sm" asChild className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md">
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
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl shadow-lg shadow-purple-500/25">
                            <Star className="h-5 w-5 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Suggested Activities</span>
                    </h2>
                    <Link href="/search" className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1 hover:gap-2 transition-all duration-300">
                        Browse all <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i} className="border-blue-100">
                                <Skeleton className="h-32 w-full bg-blue-50" />
                                <CardContent className="p-4">
                                    <Skeleton className="h-4 w-3/4 mb-2 bg-blue-50" />
                                    <Skeleton className="h-3 w-1/2 bg-blue-50" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {activities.slice(0, 4).map((activity) => (
                            <Card key={activity.id} className="group overflow-hidden hover:shadow-2xl hover:shadow-blue-500/15 transition-all duration-500 border-blue-100/50 hover:-translate-y-1">
                                <div className="relative h-36 bg-blue-50">
                                    {activity.image && (
                                        <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url(${activity.image})` }} />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-blue-500/10" />
                                    <Badge className="absolute top-2 left-2 bg-white/95 text-gray-700 text-[10px] border-0 shadow-md">
                                        {activity.category}
                                    </Badge>
                                </div>
                                <CardContent className="p-3 bg-gradient-to-r from-white to-blue-50/30">
                                    <h4 className="font-semibold text-sm line-clamp-1 mb-1 text-gray-800">{activity.name}</h4>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <DollarSign className="h-3 w-3 text-emerald-500" />
                                            {activity.cost}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3 text-blue-400" />
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
