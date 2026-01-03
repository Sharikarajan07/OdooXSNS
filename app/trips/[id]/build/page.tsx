"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ArrowLeft,
    Plus,
    Trash2,
    MapPin,
    Calendar,
    Clock,
    DollarSign,
    Save,
    Loader2,
    Search,
    Check,
    Plane,
    X,
    ChevronUp,
    ChevronDown,
    Star,
    Globe,
    Sparkles
} from "lucide-react"
import Link from "next/link"
import { 
    countries, 
    travelStops, 
    stopActivities,
    type Country, 
    type TravelStop, 
    type StopActivity,
    getStopsByCountry,
    getActivitiesByStop,
    getSuggestedActivities,
    getCountryById,
    getStopById
} from "@/lib/travel-data"

// Types for trip building
interface TripStop {
    id: string
    travelStopId: string
    travelStop: TravelStop
    country: Country
    arrivalDate: string
    departureDate: string
    orderIndex: number
    notes?: string
    activities: TripActivity[]
}

interface TripActivity {
    id: string
    stopActivityId: string
    activity: StopActivity
    startTime?: string
    orderIndex: number
    notes?: string
}

interface Trip {
    id: string
    name: string
    startDate: string
    endDate: string
}

export default function BuildItineraryPage() {
    const params = useParams()
    const router = useRouter()
    const tripId = params.id as string

    const [trip, setTrip] = useState<Trip | null>(null)
    const [tripStops, setTripStops] = useState<TripStop[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // Add stop dialog
    const [showAddStop, setShowAddStop] = useState(false)
    const [selectedCountry, setSelectedCountry] = useState("")
    const [selectedStop, setSelectedStop] = useState("")
    const [arrivalDate, setArrivalDate] = useState("")
    const [departureDate, setDepartureDate] = useState("")
    const [stopNotes, setStopNotes] = useState("")

    // Add activity dialog
    const [showAddActivity, setShowAddActivity] = useState(false)
    const [activeStopIndex, setActiveStopIndex] = useState<number | null>(null)
    const [activitySearch, setActivitySearch] = useState("")
    const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
    const [isAddingActivity, setIsAddingActivity] = useState(false)
    const [customActivityName, setCustomActivityName] = useState("")
    const [customActivityCategory, setCustomActivityCategory] = useState<'Adventure' | 'Culture' | 'Food' | 'Relaxation' | 'Nature' | 'Shopping' | 'Nightlife'>("Culture")
    const [customActivityCost, setCustomActivityCost] = useState(0)

    // Get stops for selected country
    const countryStops = selectedCountry ? getStopsByCountry(selectedCountry) : []

    // Get activities for active stop
    const activeStop = activeStopIndex !== null ? tripStops[activeStopIndex] : null
    const availableActivities = activeStop 
        ? getActivitiesByStop(activeStop.travelStopId).filter(
            a => !activeStop.activities.some(ta => ta.stopActivityId === a.id)
          )
        : []
    const suggestedActivities = activeStop 
        ? getSuggestedActivities(activeStop.travelStopId).filter(
            a => !activeStop.activities.some(ta => ta.stopActivityId === a.id)
          )
        : []

    // Get all activities for search/suggestions when no specific activities for this stop
    const allActivities = stopActivities
    const genericSuggestions = activeStop && availableActivities.length === 0
        ? allActivities.filter(a => a.isSuggested).slice(0, 6)
        : []

    const filteredActivities = availableActivities.filter(act =>
        act.name.toLowerCase().includes(activitySearch.toLowerCase()) ||
        act.category.toLowerCase().includes(activitySearch.toLowerCase())
    )

    // Search all activities if no local results
    const globalSearchResults = activitySearch.length > 0 && filteredActivities.length === 0
        ? allActivities.filter(act =>
            act.name.toLowerCase().includes(activitySearch.toLowerCase()) ||
            act.category.toLowerCase().includes(activitySearch.toLowerCase())
          ).slice(0, 10)
        : []

    useEffect(() => {
        fetchData()
    }, [tripId])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const tripRes = await fetch(`/api/trips/${tripId}`)
            const tripData = await tripRes.json()
            
            setTrip({
                id: tripData.trip?.id || tripId,
                name: tripData.trip?.name || "My Trip",
                startDate: tripData.trip?.startDate || new Date().toISOString(),
                endDate: tripData.trip?.endDate || new Date().toISOString()
            })
        } catch (error) {
            console.error('Error fetching data:', error)
            setTrip({
                id: tripId,
                name: "My Trip",
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString()
            })
        }
        setIsLoading(false)
    }

    const handleAddStop = () => {
        if (!selectedCountry || !selectedStop || !arrivalDate || !departureDate) {
            alert("Please fill in all required fields")
            return
        }

        const travelStop = getStopById(selectedStop)
        const country = getCountryById(selectedCountry)

        if (!travelStop || !country) {
            alert("Invalid selection")
            return
        }

        const newStop: TripStop = {
            id: `stop-${Date.now()}`,
            travelStopId: travelStop.id,
            travelStop: travelStop,
            country: country,
            arrivalDate: arrivalDate,
            departureDate: departureDate,
            orderIndex: tripStops.length,
            notes: stopNotes,
            activities: []
        }

        setTripStops([...tripStops, newStop])
        setShowAddStop(false)
        setSelectedCountry("")
        setSelectedStop("")
        setArrivalDate("")
        setDepartureDate("")
        setStopNotes("")
    }

    const handleDeleteStop = (index: number) => {
        if (!confirm('Delete this stop and all its activities?')) return
        const newStops = tripStops.filter((_, i) => i !== index)
        newStops.forEach((s, i) => s.orderIndex = i)
        setTripStops(newStops)
    }

    const handleMoveStop = (index: number, direction: 'up' | 'down') => {
        const newStops = [...tripStops]
        const targetIndex = direction === 'up' ? index - 1 : index + 1
        
        if (targetIndex < 0 || targetIndex >= newStops.length) return

        [newStops[index], newStops[targetIndex]] = [newStops[targetIndex], newStops[index]]
        newStops.forEach((s, i) => s.orderIndex = i)
        setTripStops(newStops)
    }

    const handleAddActivity = () => {
        if (activeStopIndex === null || !selectedActivity) {
            alert("Please select an activity")
            return
        }

        setIsAddingActivity(true)

        let newActivity: TripActivity

        if (selectedActivity === 'custom') {
            // Create a custom activity
            const customActivity: StopActivity = {
                id: `custom-${Date.now()}`,
                stopId: tripStops[activeStopIndex].travelStopId,
                name: activitySearch,
                category: 'Culture',
                description: 'Custom activity added by user',
                image: '/beautiful-travel-destination-landscape.jpg',
                cost: 0,
                duration: 120,
                rating: 5.0,
                isSuggested: false
            }
            
            newActivity = {
                id: `act-${Date.now()}`,
                stopActivityId: customActivity.id,
                activity: customActivity,
                orderIndex: tripStops[activeStopIndex].activities.length,
            }
        } else {
            const activity = stopActivities.find(a => a.id === selectedActivity)
            if (!activity) {
                setIsAddingActivity(false)
                alert("Activity not found")
                return
            }

            newActivity = {
                id: `act-${Date.now()}`,
                stopActivityId: activity.id,
                activity: activity,
                orderIndex: tripStops[activeStopIndex].activities.length,
            }
        }

        const newStops = [...tripStops]
        newStops[activeStopIndex].activities.push(newActivity)
        setTripStops(newStops)

        setShowAddActivity(false)
        setSelectedActivity(null)
        setActiveStopIndex(null)
        setActivitySearch("")
        setIsAddingActivity(false)
    }

    const handleDeleteActivity = (stopIndex: number, activityIndex: number) => {
        if (!confirm('Remove this activity?')) return
        
        const newStops = [...tripStops]
        newStops[stopIndex].activities.splice(activityIndex, 1)
        newStops[stopIndex].activities.forEach((a, i) => a.orderIndex = i)
        setTripStops(newStops)
    }

    const handleMoveActivity = (stopIndex: number, activityIndex: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? activityIndex - 1 : activityIndex + 1
        const activities = tripStops[stopIndex].activities
        
        if (targetIndex < 0 || targetIndex >= activities.length) return

        const newStops = [...tripStops]
        const [activity] = newStops[stopIndex].activities.splice(activityIndex, 1)
        newStops[stopIndex].activities.splice(targetIndex, 0, activity)
        newStops[stopIndex].activities.forEach((a, i) => a.orderIndex = i)
        setTripStops(newStops)
    }

    const handleSave = async () => {
        setIsSaving(true)
        await new Promise(resolve => setTimeout(resolve, 500))
        setIsSaving(false)
        router.push(`/trips/${tripId}`)
    }

    const totalCost = tripStops.reduce((sum, stop) =>
        sum + (stop.travelStop.costPerDay * Math.ceil(
            (new Date(stop.departureDate).getTime() - new Date(stop.arrivalDate).getTime()) / (1000 * 60 * 60 * 24) + 1
        )) + stop.activities.reduce((actSum, act) => actSum + act.activity.cost, 0), 0
    )

    const totalActivities = tripStops.reduce((sum, stop) => sum + stop.activities.length, 0)

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="container mx-auto py-8 px-4">
                    <Skeleton className="h-8 w-48 mb-8" />
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            <Skeleton className="h-64" />
                            <Skeleton className="h-64" />
                        </div>
                        <Skeleton className="h-96" />
                    </div>
                </div>
            </div>
        )
    }

    if (!trip) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="container mx-auto py-20 text-center">
                    <Plane className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-4">Trip not found</h1>
                    <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                        <Link href="/trips">Back to Trips</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container mx-auto py-8 px-4 pb-24 md:pb-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <Button variant="ghost" asChild className="mb-2 -ml-2">
                            <Link href={`/trips/${tripId}`}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Trip
                            </Link>
                        </Button>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            Build Itinerary
                        </h1>
                        <p className="text-muted-foreground">{trip.name}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            onClick={handleSave} 
                            disabled={isSaving}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save &amp; View
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-4 mb-8 p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-white/20">
                    <div className="text-center">
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            {tripStops.length}
                        </p>
                        <p className="text-sm text-muted-foreground">Stops</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                            {totalActivities}
                        </p>
                        <p className="text-sm text-muted-foreground">Activities</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">${totalCost.toFixed(0)}</p>
                        <p className="text-sm text-muted-foreground">Est. Cost</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Stops List */}
                    <div className="lg:col-span-2 space-y-6">
                        {tripStops.length > 0 ? (
                            tripStops.map((stop, stopIndex) => (
                                <Card key={stop.id} className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg">
                                    <div className="relative h-36 bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center opacity-60"
                                            style={{ backgroundImage: `url(${stop.travelStop.image})` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                        
                                        {/* Reorder buttons */}
                                        <div className="absolute top-3 left-3 flex items-center gap-1">
                                            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                                                Stop {stopIndex + 1}
                                            </Badge>
                                            <div className="flex gap-1 ml-2">
                                                <Button
                                                    variant="secondary"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => handleMoveStop(stopIndex, 'up')}
                                                    disabled={stopIndex === 0}
                                                >
                                                    <ChevronUp className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => handleMoveStop(stopIndex, 'down')}
                                                    disabled={stopIndex === tripStops.length - 1}
                                                >
                                                    <ChevronDown className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-3 right-3 h-8 w-8"
                                            onClick={() => handleDeleteStop(stopIndex)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>

                                        <div className="absolute bottom-3 left-3 right-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Globe className="h-4 w-4 text-white/80" />
                                                <span className="text-white/80 text-sm">{stop.country.name}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white">{stop.travelStop.name}</h3>
                                            <div className="flex items-center gap-3 text-white/70 text-sm mt-1">
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="h-3 w-3" />
                                                    ${stop.travelStop.costPerDay}/day
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {stop.travelStop.bestTimeToVisit}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 pb-4 border-b">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4 text-blue-500" />
                                                {new Date(stop.arrivalDate).toLocaleDateString()} - {new Date(stop.departureDate).toLocaleDateString()}
                                            </span>
                                        </div>

                                        {/* Activities */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-sm">Activities</h4>
                                                {stop.activities.length > 0 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {stop.activities.length} added
                                                    </Badge>
                                                )}
                                            </div>

                                            {stop.activities.map((act, actIndex) => (
                                                <div
                                                    key={act.id}
                                                    className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700/50 dark:to-gray-600/50 border group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex flex-col gap-0.5">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-5 w-5 opacity-50 hover:opacity-100"
                                                                onClick={() => handleMoveActivity(stopIndex, actIndex, 'up')}
                                                                disabled={actIndex === 0}
                                                            >
                                                                <ChevronUp className="h-3 w-3" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-5 w-5 opacity-50 hover:opacity-100"
                                                                onClick={() => handleMoveActivity(stopIndex, actIndex, 'down')}
                                                                disabled={actIndex === stop.activities.length - 1}
                                                            >
                                                                <ChevronDown className="h-3 w-3" />
                                                            </Button>
                                                        </div>

                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-medium text-sm">
                                                            {actIndex + 1}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{act.activity.name}</p>
                                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                                <Badge variant="secondary" className="text-xs">{act.activity.category}</Badge>
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" />
                                                                    {Math.floor(act.activity.duration / 60)}h {act.activity.duration % 60}m
                                                                </span>
                                                                {act.activity.rating >= 4.5 && (
                                                                    <span className="flex items-center gap-1 text-amber-500">
                                                                        <Star className="h-3 w-3 fill-current" />
                                                                        {act.activity.rating}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-green-600">${act.activity.cost}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDeleteActivity(stopIndex, actIndex)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}

                                            {stop.activities.length === 0 && (
                                                <p className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg">
                                                    No activities added yet. Click below to explore suggestions!
                                                </p>
                                            )}
                                        </div>

                                        <Button
                                            variant="outline"
                                            className="w-full border-blue-200 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-800 dark:hover:bg-blue-900/20"
                                            onClick={() => {
                                                setActiveStopIndex(stopIndex)
                                                setShowAddActivity(true)
                                            }}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Activity
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Card className="border-dashed border-2 border-blue-200 dark:border-blue-800 bg-white/50 dark:bg-gray-800/50">
                                <CardContent className="py-12 text-center">
                                    <MapPin className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No stops added yet</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Choose from 10 famous countries and their top destinations!
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Add Stop Button */}
                        <Dialog open={showAddStop} onOpenChange={setShowAddStop}>
                            <DialogTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    className="w-full h-20 border-dashed border-2 border-blue-300 hover:border-blue-400 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-900/20"
                                >
                                    <Plus className="mr-2 h-5 w-5 text-blue-500" />
                                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-semibold">
                                        Add New Stop
                                    </span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        <Globe className="h-5 w-5 text-blue-500" />
                                        Add a Stop
                                    </DialogTitle>
                                    <DialogDescription>
                                        Select a country, then choose a famous destination
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-blue-500" />
                                            Country *
                                        </Label>
                                        <Select 
                                            value={selectedCountry} 
                                            onValueChange={(val) => {
                                                setSelectedCountry(val)
                                                setSelectedStop("")
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {countries.map(country => (
                                                    <SelectItem key={country.id} value={country.id}>
                                                        <div className="flex items-center gap-2">
                                                            <span>{country.code}</span>
                                                            <span>{country.name}</span>
                                                            <Badge variant="secondary" className="text-xs ml-2">
                                                                {country.region}
                                                            </Badge>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-cyan-500" />
                                            Destination *
                                        </Label>
                                        <Select 
                                            value={selectedStop} 
                                            onValueChange={setSelectedStop}
                                            disabled={!selectedCountry}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={selectedCountry ? "Select a destination" : "Select a country first"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {countryStops.map(stop => (
                                                    <SelectItem key={stop.id} value={stop.id}>
                                                        <div className="flex items-center justify-between w-full">
                                                            <div>
                                                                <span className="font-medium">{stop.name}</span>
                                                                <span className="text-xs text-muted-foreground ml-2">
                                                                    ${stop.costPerDay}/day
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {selectedStop && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {getStopById(selectedStop)?.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Arrival *</Label>
                                            <Input
                                                type="date"
                                                value={arrivalDate}
                                                onChange={(e) => setArrivalDate(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Departure *</Label>
                                            <Input
                                                type="date"
                                                value={departureDate}
                                                onChange={(e) => setDepartureDate(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Notes (optional)</Label>
                                        <Textarea
                                            placeholder="Any notes about this stop..."
                                            value={stopNotes}
                                            onChange={(e) => setStopNotes(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setShowAddStop(false)}>
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={handleAddStop}
                                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                                    >
                                        Add Stop
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-blue-500" />
                                    10 Countries
                                </CardTitle>
                                <CardDescription>Explore famous destinations worldwide</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[300px] pr-2">
                                    <div className="space-y-2">
                                        {countries.map(country => (
                                            <button
                                                key={country.id}
                                                className="w-full p-3 rounded-lg border text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 hover:border-blue-300 transition-all"
                                                onClick={() => {
                                                    setSelectedCountry(country.id)
                                                    setShowAddStop(true)
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">{country.code}</span>
                                                    <div>
                                                        <p className="font-medium text-sm">{country.name}</p>
                                                        <p className="text-xs text-muted-foreground">{country.region}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-200 dark:border-blue-800">
                            <CardContent className="pt-6">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-blue-500" />
                                    How It Works
                                </h4>
                                <ul className="text-sm text-muted-foreground space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold text-blue-500">1.</span>
                                        Choose a country from 10 famous destinations
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold text-cyan-500">2.</span>
                                        Pick stops from 10 top places per country
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold text-teal-500">3.</span>
                                        Add activities with AI suggestions
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold text-green-500">4.</span>
                                        Reorder stops &amp; activities anytime
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Add Activity Dialog */}
                <Dialog open={showAddActivity} onOpenChange={(open) => {
                    setShowAddActivity(open)
                    if (!open) {
                        setSelectedActivity(null)
                        setActivitySearch("")
                    }
                }}>
                    <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-amber-500" />
                                Add Activity
                                {activeStop && (
                                    <Badge variant="secondary" className="ml-2">
                                        {activeStop.travelStop.name}
                                    </Badge>
                                )}
                            </DialogTitle>
                            <DialogDescription>
                                Choose from suggested activities or search for more
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="flex-1 overflow-hidden py-4 space-y-4">
                            {/* Show stop-specific suggestions OR generic suggestions if none available */}
                            {(suggestedActivities.length > 0 || genericSuggestions.length > 0) && (
                                <div>
                                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                        <Star className="h-4 w-4 text-amber-500" />
                                        {suggestedActivities.length > 0 ? 'Suggested for You' : 'Popular Activities'}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(suggestedActivities.length > 0 ? suggestedActivities : genericSuggestions).map(activity => (
                                            <button
                                                key={activity.id}
                                                className={`relative p-3 rounded-lg border text-left transition-all ${
                                                    selectedActivity === activity.id
                                                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 ring-2 ring-blue-200'
                                                        : 'hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                                                }`}
                                                onClick={() => setSelectedActivity(activity.id)}
                                            >
                                                {selectedActivity === activity.id && (
                                                    <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full p-1">
                                                        <Check className="h-3 w-3" />
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1 mb-1">
                                                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                                    <span className="text-xs text-amber-600">Recommended</span>
                                                </div>
                                                <p className="font-medium text-sm pr-6">{activity.name}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <Badge variant="secondary" className="text-xs">{activity.category}</Badge>
                                                    <span className="text-sm font-semibold text-green-600">${activity.cost}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <div className="relative mb-3">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search activities or type custom activity..."
                                        className="pl-10"
                                        value={activitySearch}
                                        onChange={(e) => setActivitySearch(e.target.value)}
                                    />
                                </div>
                                
                                <ScrollArea className="h-[250px]">
                                    <div className="grid grid-cols-2 gap-2 pr-2">
                                        {/* Show filtered activities from this stop */}
                                        {filteredActivities.map(activity => (
                                            <button
                                                key={activity.id}
                                                className={`relative p-3 rounded-lg border text-left transition-all ${
                                                    selectedActivity === activity.id
                                                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 ring-2 ring-blue-200'
                                                        : 'hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                                                }`}
                                                onClick={() => setSelectedActivity(activity.id)}
                                            >
                                                {selectedActivity === activity.id && (
                                                    <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full p-1">
                                                        <Check className="h-3 w-3" />
                                                    </div>
                                                )}
                                                <p className="font-medium text-sm pr-6">{activity.name}</p>
                                                <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{activity.description}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="text-xs">{activity.category}</Badge>
                                                        <span className="flex items-center gap-0.5 text-xs text-amber-600">
                                                            <Star className="h-3 w-3 fill-current" />
                                                            {activity.rating}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-semibold text-green-600">${activity.cost}</span>
                                                </div>
                                            </button>
                                        ))}

                                        {/* Show global search results when no local results */}
                                        {filteredActivities.length === 0 && globalSearchResults.map(activity => (
                                            <button
                                                key={activity.id}
                                                className={`relative p-3 rounded-lg border text-left transition-all ${
                                                    selectedActivity === activity.id
                                                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 ring-2 ring-blue-200'
                                                        : 'hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                                                }`}
                                                onClick={() => setSelectedActivity(activity.id)}
                                            >
                                                {selectedActivity === activity.id && (
                                                    <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full p-1">
                                                        <Check className="h-3 w-3" />
                                                    </div>
                                                )}
                                                <p className="font-medium text-sm pr-6">{activity.name}</p>
                                                <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{activity.description}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="text-xs">{activity.category}</Badge>
                                                        <span className="flex items-center gap-0.5 text-xs text-amber-600">
                                                            <Star className="h-3 w-3 fill-current" />
                                                            {activity.rating}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-semibold text-green-600">${activity.cost}</span>
                                                </div>
                                            </button>
                                        ))}

                                        {/* Show all activities when search is empty and no local activities */}
                                        {!activitySearch && filteredActivities.length === 0 && availableActivities.length === 0 && allActivities.slice(0, 8).map(activity => (
                                            <button
                                                key={activity.id}
                                                className={`relative p-3 rounded-lg border text-left transition-all ${
                                                    selectedActivity === activity.id
                                                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 ring-2 ring-blue-200'
                                                        : 'hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                                                }`}
                                                onClick={() => setSelectedActivity(activity.id)}
                                            >
                                                {selectedActivity === activity.id && (
                                                    <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full p-1">
                                                        <Check className="h-3 w-3" />
                                                    </div>
                                                )}
                                                <p className="font-medium text-sm pr-6">{activity.name}</p>
                                                <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{activity.description}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="text-xs">{activity.category}</Badge>
                                                        <span className="flex items-center gap-0.5 text-xs text-amber-600">
                                                            <Star className="h-3 w-3 fill-current" />
                                                            {activity.rating}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-semibold text-green-600">${activity.cost}</span>
                                                </div>
                                            </button>
                                        ))}

                                        {/* Custom activity option when typing */}
                                        {activitySearch.length > 2 && (
                                            <button
                                                className={`relative p-3 rounded-lg border text-left transition-all col-span-2 ${
                                                    selectedActivity === 'custom'
                                                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 ring-2 ring-blue-200'
                                                        : 'hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 border-dashed'
                                                }`}
                                                onClick={() => setSelectedActivity('custom')}
                                            >
                                                {selectedActivity === 'custom' && (
                                                    <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full p-1">
                                                        <Check className="h-3 w-3" />
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <Plus className="h-4 w-4 text-blue-500" />
                                                    <div>
                                                        <p className="font-medium text-sm">Add "{activitySearch}" as custom activity</p>
                                                        <p className="text-xs text-muted-foreground">Create your own activity</p>
                                                    </div>
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>

                        <DialogFooter className="border-t pt-4">
                            <Button variant="outline" onClick={() => setShowAddActivity(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAddActivity}
                                disabled={!selectedActivity || isAddingActivity}
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                            >
                                {isAddingActivity ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Activity
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
