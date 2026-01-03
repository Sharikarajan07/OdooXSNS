"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Search,
    MapPin,
    Plus,
    Star,
    DollarSign,
    TrendingUp,
    Filter,
    Globe,
    ArrowLeft
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface City {
    id: string
    name: string
    country: string
    region: string
    image: string
    description: string
    costIndex: number
    popularity: number
    _count?: { stops: number }
}

export default function CitySearchPage() {
    const [query, setQuery] = useState("")
    const [region, setRegion] = useState("all")
    const [sortBy, setSortBy] = useState("popularity")
    const [cities, setCities] = useState<City[]>([])
    const [regions, setRegions] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchCities()
    }, [query, region, sortBy])

    const fetchCities = async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (query) params.set('q', query)
            if (region && region !== 'all') params.set('region', region)
            params.set('sortBy', sortBy)

            const res = await fetch(`/api/cities?${params}`)
            const data = await res.json()
            setCities(data.cities || [])
            setRegions(data.regions || [])
        } catch (error) {
            console.error('Error fetching cities:', error)
        }
        setIsLoading(false)
    }

    const getCostLabel = (costIndex: number) => {
        if (costIndex < 40) return { label: "Budget", color: "bg-green-500" }
        if (costIndex < 70) return { label: "Moderate", color: "bg-yellow-500" }
        return { label: "Expensive", color: "bg-red-500" }
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <Button variant="ghost" asChild className="mb-6">
                <Link href="/search">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Search
                </Link>
            </Button>

            {/* Header */}
            <div className="mb-10 text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <Globe className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold mb-4">Explore Destinations</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Discover amazing cities around the world and add them to your trip itinerary.
                </p>
            </div>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto mb-8 space-y-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        className="pl-12 h-14 text-lg rounded-full shadow-lg border-primary/20"
                        placeholder="Search cities by name or country..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Select value={region} onValueChange={setRegion}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Regions" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Regions</SelectItem>
                                {regions.map((r) => (
                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="popularity">Most Popular</SelectItem>
                            <SelectItem value="costIndex">Lowest Cost</SelectItem>
                            <SelectItem value="name">Alphabetical</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Results */}
            {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <Skeleton className="h-48 w-full" />
                            <CardContent className="p-4 space-y-2">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : cities.length === 0 ? (
                <div className="text-center py-20">
                    <MapPin className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No cities found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {cities.map((city) => {
                        const cost = getCostLabel(city.costIndex)
                        return (
                            <Card key={city.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                                <CardHeader className="p-0">
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={city.image || "/placeholder.svg"}
                                            alt={city.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                        {/* Badges */}
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            <Badge className={`${cost.color} text-white`}>
                                                <DollarSign className="h-3 w-3 mr-1" />
                                                {cost.label}
                                            </Badge>
                                        </div>

                                        {/* City Info */}
                                        <div className="absolute bottom-3 left-3 right-3">
                                            <CardTitle className="text-white text-xl mb-1">{city.name}</CardTitle>
                                            <p className="text-white/80 text-sm flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {city.country}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-4">
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                        {city.description}
                                    </p>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <TrendingUp className="h-4 w-4" />
                                            <span>{city.popularity}% popularity</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                            <span className="font-medium">4.{Math.floor(Math.random() * 3) + 5}</span>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-4 pt-0">
                                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add to Trip
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
