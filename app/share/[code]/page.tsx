"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    MapPin,
    Calendar,
    DollarSign,
    Clock,
    Copy,
    Check,
    Share2,
    Twitter,
    Facebook,
    Link as LinkIcon,
    Plane,
    User
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface SharedTrip {
    id: string
    name: string
    description: string
    coverImage: string
    startDate: string
    endDate: string
    totalBudget: number
    user: {
        name: string
        avatar: string
    }
    stops: Array<{
        id: string
        city: {
            name: string
            country: string
            image: string
        }
        arrivalDate: string
        departureDate: string
        activities: Array<{
            activity: {
                name: string
                cost: number
                duration: number
                category: string
            }
        }>
    }>
    expenses: Array<{
        category: string
        amount: number
    }>
}

export default function SharedTripPage() {
    const params = useParams()
    const code = params.code as string
    const [trip, setTrip] = useState<SharedTrip | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        fetchTrip()
    }, [code])

    const fetchTrip = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/share/${code}`)
            const data = await res.json()
            if (res.ok) {
                setTrip(data.trip)
            } else {
                setError(data.error || "Trip not found")
            }
        } catch (err) {
            setError("Failed to load trip")
        }
        setIsLoading(false)
    }

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const shareToTwitter = () => {
        const text = `Check out my trip: ${trip?.name}`
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank')
    }

    const shareToFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (error || !trip) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md w-full mx-4">
                    <CardContent className="pt-6 text-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plane className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Trip Not Found</h2>
                        <p className="text-muted-foreground mb-4">{error || "This trip doesn't exist or is no longer shared."}</p>
                        <Button asChild>
                            <Link href="/">Go to Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const totalExpenses = trip.expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const totalActivities = trip.stops.reduce((sum, stop) => sum + stop.activities.length, 0)

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Hero Section */}
            <div className="relative h-[50vh] min-h-[400px]">
                <Image
                    src={trip.coverImage || trip.stops[0]?.city.image || "/placeholder.svg"}
                    alt={trip.name}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="container mx-auto max-w-5xl">
                        <Badge className="mb-4 bg-primary/90">Shared Itinerary</Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                            {trip.name}
                        </h1>
                        <p className="text-lg text-white/80 mb-6 max-w-2xl">
                            {trip.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 text-white/90">
                            <span className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                {trip.stops.length} {trip.stops.length === 1 ? 'City' : 'Cities'}
                            </span>
                            <span className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                ${totalExpenses.toLocaleString()} estimated
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-4 py-8">
                {/* Creator Info & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 p-4 rounded-xl bg-card border">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={trip.user.avatar} />
                            <AvatarFallback>
                                <User className="h-6 w-6" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">Created by {trip.user.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {totalActivities} activities planned
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={copyLink}>
                            {copied ? <Check className="mr-2 h-4 w-4" /> : <LinkIcon className="mr-2 h-4 w-4" />}
                            {copied ? "Copied!" : "Copy Link"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={shareToTwitter}>
                            <Twitter className="mr-2 h-4 w-4" />
                            Twitter
                        </Button>
                        <Button variant="outline" size="sm" onClick={shareToFacebook}>
                            <Facebook className="mr-2 h-4 w-4" />
                            Facebook
                        </Button>
                        <Button size="sm">
                            <Copy className="mr-2 h-4 w-4" />
                            Copy This Trip
                        </Button>
                    </div>
                </div>

                {/* Itinerary */}
                <h2 className="text-2xl font-bold mb-6">Itinerary</h2>

                <div className="space-y-8">
                    {trip.stops.map((stop, stopIndex) => (
                        <Card key={stop.id} className="overflow-hidden">
                            <div className="relative h-48">
                                <Image
                                    src={stop.city.image || "/placeholder.svg"}
                                    alt={stop.city.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="secondary" className="bg-white/90">
                                            Stop {stopIndex + 1}
                                        </Badge>
                                    </div>
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

                                <Separator className="my-4" />

                                <h4 className="font-semibold mb-4">Planned Activities</h4>
                                <div className="space-y-3">
                                    {stop.activities.map((act, actIndex) => (
                                        <div
                                            key={actIndex}
                                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                                                    {actIndex + 1}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{act.activity.name}</p>
                                                    <p className="text-sm text-muted-foreground">{act.activity.category}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">${act.activity.cost}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {Math.floor(act.activity.duration / 60)}h {act.activity.duration % 60}m
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {stop.activities.length === 0 && (
                                        <p className="text-muted-foreground text-center py-4">
                                            No activities planned for this stop
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {trip.stops.length === 0 && (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                                <p className="text-muted-foreground">No stops added to this trip yet</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Budget Summary */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                            Budget Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid sm:grid-cols-3 gap-4 text-center">
                            <div className="p-4 rounded-lg bg-muted/50">
                                <p className="text-2xl font-bold">${trip.totalBudget.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Total Budget</p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/50">
                                <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Estimated Cost</p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/50">
                                <p className="text-2xl font-bold text-green-600">
                                    ${(trip.totalBudget - totalExpenses).toLocaleString()}
                                </p>
                                <p className="text-sm text-muted-foreground">Remaining</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* CTA */}
                <Card className="mt-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                    <CardContent className="py-8 text-center">
                        <h3 className="text-2xl font-bold mb-2">Love this itinerary?</h3>
                        <p className="text-muted-foreground mb-6">
                            Create your own personalized travel plan with GlobeTrotter
                        </p>
                        <Button size="lg" asChild>
                            <Link href="/">
                                <Plane className="mr-2 h-5 w-5" />
                                Start Planning Your Trip
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
