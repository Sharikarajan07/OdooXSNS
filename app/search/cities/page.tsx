"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Search,
    MapPin,
    Plus,
    Star,
    DollarSign,
    TrendingUp,
    Filter,
    Globe,
    ArrowLeft,
    Check,
    Calendar
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

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

interface Trip {
    id: string
    name: string
    startDate: string
    endDate: string
}

export default function CitySearchPage() {
    const [query, setQuery] = useState("")
    const [region, setRegion] = useState("all")
    const [country, setCountry] = useState("all")
    const [sortBy, setSortBy] = useState("popularity")
    const [cities, setCities] = useState<City[]>([])
    const [filteredCities, setFilteredCities] = useState<City[]>([])
    const [regions, setRegions] = useState<string[]>([])
    const [countries, setCountries] = useState<string[]>([])
    const [trips, setTrips] = useState<Trip[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [addedCities, setAddedCities] = useState<Set<string>>(new Set())

    // Dialog state
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [selectedCity, setSelectedCity] = useState<City | null>(null)
    const [selectedTripId, setSelectedTripId] = useState("")
    const [arrivalDate, setArrivalDate] = useState("")
    const [departureDate, setDepartureDate] = useState("")

    useEffect(() => {
        fetchCities()
        fetchTrips()
    }, [])

    useEffect(() => {
        filterCities()
    }, [query, region, country, sortBy, cities])

    const fetchCities = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/cities`)
            const data = await res.json()
            const allCities = data.cities || []
            setCities(allCities)
            setFilteredCities(allCities)
            
            // Extract unique regions and countries
            const uniqueRegions = Array.from(new Set(allCities.map((c: City) => c.region))).sort() as string[]
            setRegions(uniqueRegions)
            const uniqueCountries = Array.from(new Set(allCities.map((c: City) => c.country))).sort() as string[]
            setCountries(uniqueCountries)
        } catch (error) {
            console.error('Error fetching cities:', error)
        }
        setIsLoading(false)
    }

    const fetchTrips = async () => {
        try {
            const res = await fetch('/api/trips')
            const data = await res.json()
            setTrips(data.trips || [])
        } catch (error) {
            console.error('Error fetching trips:', error)
        }
    }

    const filterCities = () => {
        let result = [...cities]

        if (query) {
            result = result.filter(city =>
                city.name.toLowerCase().includes(query.toLowerCase()) ||
                city.country.toLowerCase().includes(query.toLowerCase())
            )
        }

        if (region !== 'all') {
            result = result.filter(city => city.region === region)
        }

        if (country !== 'all') {
            result = result.filter(city => city.country === country)
        }

        // Sorting
        switch (sortBy) {
            case 'popularity':
                result.sort((a, b) => b.popularity - a.popularity)
                break
            case 'costIndex':
                result.sort((a, b) => a.costIndex - b.costIndex)
                break
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name))
                break
        }

        setFilteredCities(result)
    }

    // Update countries when region changes
    useEffect(() => {
        if (region === 'all') {
            const uniqueCountries = Array.from(new Set(cities.map(c => c.country))).sort() as string[]
            setCountries(uniqueCountries)
        } else {
            const filteredCountries = Array.from(
                new Set(cities.filter(c => c.region === region).map(c => c.country))
            ).sort() as string[]
            setCountries(filteredCountries)
        }
        setCountry('all')
    }, [region, cities])

    const handleOpenAddDialog = (city: City) => {
        setSelectedCity(city)
        setSelectedTripId("")
        setArrivalDate("")
        setDepartureDate("")
        setIsAddDialogOpen(true)
    }

    const handleAddToTrip = async () => {
        if (!selectedCity || !selectedTripId || !arrivalDate || !departureDate) {
            toast.error("Please fill in all fields")
            return
        }

        try {
            const res = await fetch("/api/stops", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tripId: selectedTripId,
                    cityId: selectedCity.id,
                    arrivalDate,
                    departureDate,
                    notes: ""
                })
            })

            if (res.ok) {
                setAddedCities(prev => new Set(prev).add(selectedCity.id))
                toast.success(`${selectedCity.name} added to trip!`)
                setIsAddDialogOpen(false)
            } else {
                toast.error("Failed to add city to trip")
            }
        } catch (error) {
            console.error("Error adding city:", error)
            toast.error("Failed to add city to trip")
        }
    }

    const getCostLabel = (costIndex: number) => {
        if (costIndex < 40) return { label: "Budget", color: "bg-emerald-500" }
        if (costIndex < 70) return { label: "Moderate", color: "bg-amber-500" }
        return { label: "Premium", color: "bg-rose-500" }
    }

    return (
        <div className="container mx-auto py-8 px-4 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 min-h-screen pb-24 md:pb-8">
            <Button variant="ghost" asChild className="mb-6 hover:bg-blue-50 hover:text-blue-600">
                <Link href="/search">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Search
                </Link>
            </Button>

            {/* Header */}
            <div className="mb-10 text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl shadow-blue-500/30">
                        <Globe className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">Explore Destinations</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Discover amazing cities around the world and add them to your trip itinerary.
                </p>
            </div>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto mb-8 space-y-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
                    <Input
                        className="pl-12 h-14 text-lg rounded-full shadow-xl border-blue-200 focus:border-blue-400 focus:ring-blue-500/20"
                        placeholder="Search cities by name or country..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-blue-400" />
                        <Select value={region} onValueChange={setRegion}>
                            <SelectTrigger className="w-[180px] border-blue-200">
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

                    <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger className="w-[180px] border-blue-200">
                            <SelectValue placeholder="All Countries" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Countries</SelectItem>
                            {countries.map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px] border-blue-200">
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
                        <Card key={i} className="overflow-hidden border-blue-100">
                            <Skeleton className="h-48 w-full bg-blue-50" />
                            <CardContent className="p-4 space-y-2">
                                <Skeleton className="h-6 w-3/4 bg-blue-50" />
                                <Skeleton className="h-4 w-1/2 bg-blue-50" />
                                <Skeleton className="h-4 w-full bg-blue-50" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredCities.length === 0 ? (
                <div className="text-center py-20">
                    <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                        <MapPin className="h-12 w-12 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-700">No cities found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCities.map((city) => {
                        const cost = getCostLabel(city.costIndex)
                        const isAdded = addedCities.has(city.id)
                        return (
                            <Card key={city.id} className="group overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 border-blue-100/50 hover:-translate-y-1">
                                <CardHeader className="p-0">
                                    <div className="relative h-52 overflow-hidden">
                                        <Image
                                            src={city.image || "/placeholder.svg"}
                                            alt={city.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-blue-500/10" />

                                        {/* Badges */}
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            <Badge className={`${cost.color} text-white border-0 shadow-lg`}>
                                                <DollarSign className="h-3 w-3 mr-1" />
                                                {cost.label}
                                            </Badge>
                                        </div>

                                        {/* City Info */}
                                        <div className="absolute bottom-3 left-3 right-3">
                                            <CardTitle className="text-white text-xl mb-1 drop-shadow-lg">{city.name}</CardTitle>
                                            <p className="text-white/90 text-sm flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {city.country}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-4 bg-gradient-to-r from-white to-blue-50/30">
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                        {city.description}
                                    </p>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-1 text-gray-500">
                                            <TrendingUp className="h-4 w-4 text-blue-400" />
                                            <span>{city.popularity}% popularity</span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-full">
                                            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                            <span className="font-medium text-amber-700">4.{Math.floor(Math.random() * 3) + 5}</span>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-4 pt-0 bg-gradient-to-r from-white to-blue-50/30">
                                    <Button 
                                        className={`w-full ${
                                            isAdded 
                                                ? "bg-green-500 hover:bg-green-600" 
                                                : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                                        } text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300`}
                                        onClick={() => !isAdded && handleOpenAddDialog(city)}
                                        disabled={isAdded}
                                    >
                                        {isAdded ? (
                                            <>
                                                <Check className="mr-2 h-4 w-4" />
                                                Added to Trip
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add to Trip
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Add to Trip Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-blue-500" />
                            Add {selectedCity?.name} to Trip
                        </DialogTitle>
                        <DialogDescription>
                            Select a trip and set your travel dates for this destination.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Select Trip</Label>
                            <Select value={selectedTripId} onValueChange={setSelectedTripId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a trip" />
                                </SelectTrigger>
                                <SelectContent>
                                    {trips.map(trip => (
                                        <SelectItem key={trip.id} value={trip.id}>
                                            {trip.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {trips.length === 0 && (
                                <p className="text-sm text-amber-600">No trips available. Create a trip first!</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Arrival Date
                                </Label>
                                <Input
                                    type="date"
                                    value={arrivalDate}
                                    onChange={(e) => setArrivalDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Departure Date
                                </Label>
                                <Input
                                    type="date"
                                    value={departureDate}
                                    onChange={(e) => setDepartureDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleAddToTrip}
                            disabled={!selectedTripId || !arrivalDate || !departureDate}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add to Trip
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
