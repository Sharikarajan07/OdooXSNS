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
    GripVertical,
    MapPin,
    Calendar,
    Clock,
    DollarSign,
    Save,
    Loader2,
    Search,
    Check,
    Plane,
    X
} from "lucide-react"
import Link from "next/link"

interface Activity {
    id: string
    name: string
    category: string
    cost: number
    duration: number
    image: string
}

interface StopActivity {
    id: string
    activity: Activity
    startTime?: string
    orderIndex: number
    notes?: string
}

interface City {
    id: string
    name: string
    country: string
    image: string
}

interface Stop {
    id: string
    city: City
    arrivalDate: string
    departureDate: string
    activities: StopActivity[]
    orderIndex: number
    notes?: string
}

interface Trip {
    id: string
    name: string
    startDate: string
    endDate: string
    stops: Stop[]
}

export default function BuildItineraryPage() {
    const params = useParams()
    const router = useRouter()
    const tripId = params.id as string

    const [trip, setTrip] = useState<Trip | null>(null)
    const [cities, setCities] = useState<City[]>([])
    const [activities, setActivities] = useState<Activity[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isAddingActivity, setIsAddingActivity] = useState(false)

    // Add stop dialog
    const [showAddStop, setShowAddStop] = useState(false)
    const [selectedCity, setSelectedCity] = useState("")
    const [arrivalDate, setArrivalDate] = useState("")
    const [departureDate, setDepartureDate] = useState("")
    const [stopNotes, setStopNotes] = useState("")

    // Add activity dialog
    const [showAddActivity, setShowAddActivity] = useState(false)
    const [activeStopId, setActiveStopId] = useState<string | null>(null)
    const [activitySearch, setActivitySearch] = useState("")
    const [selectedActivity, setSelectedActivity] = useState<string | null>(null)

    useEffect(() => {
        fetchData()
    }, [tripId])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [tripRes, citiesRes, activitiesRes] = await Promise.all([
                fetch(`/api/trips/${tripId}`),
                fetch('/api/cities'),
                fetch('/api/activities'),
            ])

            const tripData = await tripRes.json()
            const citiesData = await citiesRes.json()
            const activitiesData = await activitiesRes.json()

            setTrip(tripData.trip)
            setCities(citiesData.cities || [])
            setActivities(activitiesData.activities || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        }
        setIsLoading(false)
    }

    const handleAddStop = async () => {
        if (!selectedCity || !arrivalDate || !departureDate) {
            alert("Please fill in all required fields")
            return
        }

        try {
            const res = await fetch('/api/stops', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tripId,
                    cityId: selectedCity,
                    arrivalDate,
                    departureDate,
                    notes: stopNotes,
                }),
            })

            if (res.ok) {
                await fetchData()
                setShowAddStop(false)
                setSelectedCity("")
                setArrivalDate("")
                setDepartureDate("")
                setStopNotes("")
            } else {
                const data = await res.json()
                alert(data.error || "Failed to add stop")
            }
        } catch (error) {
            console.error('Error adding stop:', error)
            alert("Failed to add stop")
        }
    }

    const handleDeleteStop = async (stopId: string) => {
        if (!confirm('Delete this stop and all its activities?')) return

        try {
            const res = await fetch(`/api/stops?id=${stopId}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                await fetchData()
            } else {
                alert("Failed to delete stop")
            }
        } catch (error) {
            console.error('Error deleting stop:', error)
            alert("Failed to delete stop")
        }
    }

    const handleAddActivity = async () => {
        if (!activeStopId || !selectedActivity) {
            alert("Please select an activity")
            return
        }

        setIsAddingActivity(true)

        try {
            const res = await fetch('/api/stop-activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    stopId: activeStopId,
                    activityId: selectedActivity,
                }),
            })

            if (res.ok) {
                await fetchData()
                setShowAddActivity(false)
                setSelectedActivity(null)
                setActiveStopId(null)
                setActivitySearch("")
            } else {
                const data = await res.json()
                alert(data.error || "Failed to add activity")
            }
        } catch (error) {
            console.error('Error adding activity:', error)
            alert("Failed to add activity")
        }

        setIsAddingActivity(false)
    }

    const handleDeleteActivity = async (stopActivityId: string) => {
        if (!confirm('Remove this activity?')) return

        try {
            const res = await fetch(`/api/stop-activities?id=${stopActivityId}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                await fetchData()
            } else {
                alert("Failed to remove activity")
            }
        } catch (error) {
            console.error('Error removing activity:', error)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        await new Promise(resolve => setTimeout(resolve, 500))
        setIsSaving(false)
        router.push(`/trips/${tripId}`)
    }

    const filteredActivities = activities.filter(act =>
        act.name.toLowerCase().includes(activitySearch.toLowerCase()) ||
        act.category.toLowerCase().includes(activitySearch.toLowerCase())
    )

    const totalCost = trip?.stops.reduce((sum, stop) =>
        sum + stop.activities.reduce((actSum, act) => actSum + (act.activity.cost || 0), 0), 0
    ) || 0

    const totalActivities = trip?.stops.reduce((sum, stop) => sum + stop.activities.length, 0) || 0

    if (isLoading) {
        return (
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
        )
    }

    if (!trip) {
        return (
            <div className="container mx-auto py-20 text-center">
                <Plane className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-4">Trip not found</h1>
                <Button asChild>
                    <Link href="/trips">Back to Trips</Link>
                </Button>
            </div>
        )
    }

    return (
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
                    <h1 className="text-3xl font-bold">Build Itinerary</h1>
                    <p className="text-muted-foreground">{trip.name}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSave} disabled={isSaving}>
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
            <div className="grid grid-cols-3 gap-4 mb-8 p-4 rounded-xl bg-muted/50">
                <div className="text-center">
                    <p className="text-2xl font-bold">{trip.stops.length}</p>
                    <p className="text-sm text-muted-foreground">Cities</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold">{totalActivities}</p>
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
                    {trip.stops.length > 0 ? (
                        trip.stops.map((stop, stopIndex) => (
                            <Card key={stop.id} className="overflow-hidden">
                                <div className="relative h-32 bg-gradient-to-r from-primary/20 to-primary/10">
                                    {stop.city.image && (
                                        <div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{ backgroundImage: `url(${stop.city.image})` }}
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
                                    <div className="absolute top-3 left-3">
                                        <Badge variant="secondary">Stop {stopIndex + 1}</Badge>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-3 right-3 h-8 w-8"
                                        onClick={() => handleDeleteStop(stop.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <div className="absolute bottom-3 left-3">
                                        <h3 className="text-xl font-bold text-white">{stop.city.name}</h3>
                                        <p className="text-white/80 text-sm">{stop.city.country}</p>
                                    </div>
                                </div>

                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(stop.arrivalDate).toLocaleDateString()} - {new Date(stop.departureDate).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* Activities */}
                                    <div className="space-y-2 mb-4">
                                        {stop.activities.map((act, actIndex) => (
                                            <div
                                                key={act.id}
                                                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                                                        {actIndex + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{act.activity.name}</p>
                                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                            <span>{act.activity.category}</span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {Math.floor(act.activity.duration / 60)}h {act.activity.duration % 60}m
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-green-600">${act.activity.cost}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => handleDeleteActivity(act.id)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}

                                        {stop.activities.length === 0 && (
                                            <p className="text-sm text-muted-foreground text-center py-4">
                                                No activities added yet. Click below to add one.
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => {
                                            setActiveStopId(stop.id)
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
                        <Card className="border-dashed">
                            <CardContent className="py-12 text-center">
                                <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No stops added yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    Start by adding your first destination
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Add Stop Button */}
                    <Dialog open={showAddStop} onOpenChange={setShowAddStop}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full h-20 border-dashed">
                                <Plus className="mr-2 h-5 w-5" />
                                Add New Stop
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add a Stop</DialogTitle>
                                <DialogDescription>
                                    Choose a city and set your arrival/departure dates
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>City *</Label>
                                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a city" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cities.map(city => (
                                                <SelectItem key={city.id} value={city.id}>
                                                    {city.name}, {city.country}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                <Button onClick={handleAddStop}>
                                    Add Stop
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Activity Picker Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Available Activities</CardTitle>
                            <CardDescription>Click to add to selected stop</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search activities..."
                                    className="pl-10"
                                    value={activitySearch}
                                    onChange={(e) => setActivitySearch(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                {filteredActivities.slice(0, 10).map(activity => (
                                    <button
                                        key={activity.id}
                                        className="w-full p-3 rounded-lg border text-left hover:bg-muted/50 hover:border-primary/50 transition-colors"
                                        onClick={() => {
                                            if (trip.stops.length > 0) {
                                                setActiveStopId(trip.stops[0].id)
                                                setSelectedActivity(activity.id)
                                                setShowAddActivity(true)
                                            } else {
                                                alert("Please add a stop first before adding activities")
                                            }
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-sm">{activity.name}</p>
                                                <p className="text-xs text-muted-foreground">{activity.category}</p>
                                            </div>
                                            <span className="text-sm font-semibold text-green-600">${activity.cost}</span>
                                        </div>
                                    </button>
                                ))}

                                {filteredActivities.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No activities found
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tips Card */}
                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="pt-6">
                            <h4 className="font-semibold mb-2">💡 Tips</h4>
                            <ul className="text-sm text-muted-foreground space-y-2">
                                <li>• Click &quot;Add Activity&quot; on a stop to add activities</li>
                                <li>• Hover over activities to see delete option</li>
                                <li>• Add notes for each stop</li>
                                <li>• Track your budget in real-time</li>
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
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Add Activity to Stop</DialogTitle>
                        <DialogDescription>
                            Search and select an activity to add
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden py-4">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search activities..."
                                className="pl-10"
                                value={activitySearch}
                                onChange={(e) => setActivitySearch(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
                            {filteredActivities.map(activity => (
                                <button
                                    key={activity.id}
                                    className={`relative p-3 rounded-lg border text-left transition-all ${selectedActivity === activity.id
                                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                        : 'hover:border-primary/50 hover:bg-muted/50'
                                        }`}
                                    onClick={() => setSelectedActivity(activity.id)}
                                >
                                    {selectedActivity === activity.id && (
                                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                                            <Check className="h-3 w-3" />
                                        </div>
                                    )}
                                    <p className="font-medium text-sm pr-6">{activity.name}</p>
                                    <div className="flex items-center justify-between mt-1">
                                        <Badge variant="secondary" className="text-xs">{activity.category}</Badge>
                                        <span className="text-sm font-semibold text-green-600">${activity.cost}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                    <DialogFooter className="border-t pt-4">
                        <Button variant="outline" onClick={() => setShowAddActivity(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddActivity}
                            disabled={!selectedActivity || isAddingActivity}
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
    )
}
