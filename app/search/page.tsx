"use client"

import { useState, useEffect, Suspense } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Search,
  MapPin,
  Plus,
  Star,
  Clock,
  DollarSign,
  Filter,
  Compass,
  UtensilsCrossed,
  Palette,
  Mountain,
  Sparkles,
  Ticket,
  Check,
  Globe,
  Eye,
  X,
  Trash2
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

interface Activity {
  id: string
  name: string
  category: string
  description: string
  image: string
  cost: number
  duration: number
  rating: number
  city?: { name: string; country: string }
}

interface Trip {
  id: string
  name: string
  stops: Array<{ id: string; city: { name: string } }>
}

const categoryIcons: Record<string, React.ReactNode> = {
  Adventure: <Mountain className="h-4 w-4" />,
  Food: <UtensilsCrossed className="h-4 w-4" />,
  Culture: <Palette className="h-4 w-4" />,
  Relaxation: <Sparkles className="h-4 w-4" />,
  Entertainment: <Ticket className="h-4 w-4" />,
}

function SearchContent() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("rating")
  const [maxCost, setMaxCost] = useState([500])
  const [activities, setActivities] = useState<Activity[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [addedActivities, setAddedActivities] = useState<Set<string>>(new Set())
  const [trips, setTrips] = useState<Trip[]>([])

  // Add to Trip Dialog
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [selectedTripId, setSelectedTripId] = useState("")
  const [selectedStopId, setSelectedStopId] = useState("")

  // Quick View Dialog
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [quickViewActivity, setQuickViewActivity] = useState<Activity | null>(null)

  useEffect(() => {
    fetchActivities()
    fetchTrips()
  }, [query, category, sortBy, maxCost])

  const fetchActivities = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (category && category !== 'all') params.set('category', category)
      params.set('sortBy', sortBy)
      params.set('maxCost', maxCost[0].toString())

      const res = await fetch(`/api/activities?${params}`)
      const data = await res.json()
      setActivities(data.activities || [])
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error fetching activities:', error)
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

  const handleOpenAddDialog = (activity: Activity) => {
    setSelectedActivity(activity)
    setSelectedTripId("")
    setSelectedStopId("")
    setIsAddDialogOpen(true)
  }

  const handleAddToTrip = async () => {
    if (!selectedActivity || !selectedTripId || !selectedStopId) {
      toast.error("Please select a trip and stop")
      return
    }

    try {
      const res = await fetch("/api/stop-activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stopId: selectedStopId,
          activityId: selectedActivity.id,
          startTime: null
        })
      })

      if (res.ok) {
        setAddedActivities(prev => new Set(prev).add(selectedActivity.id))
        toast.success(`${selectedActivity.name} added to trip!`)
        setIsAddDialogOpen(false)
      } else {
        toast.error("Failed to add activity")
      }
    } catch (error) {
      console.error("Error adding activity:", error)
      toast.error("Failed to add activity")
    }
  }

  const handleRemoveFromTrip = (activityId: string) => {
    setAddedActivities(prev => {
      const newSet = new Set(prev)
      newSet.delete(activityId)
      return newSet
    })
    toast.success("Activity removed from selection")
  }

  const handleOpenQuickView = (activity: Activity) => {
    setQuickViewActivity(activity)
    setIsQuickViewOpen(true)
  }

  const selectedTrip = trips.find(t => t.id === selectedTripId)

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  return (
    <div className="container mx-auto py-8 px-4 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 min-h-screen">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl shadow-blue-500/30">
            <Compass className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">Discover Experiences</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Find amazing activities, tours, and experiences to add to your trip.
        </p>
      </div>

      {/* Quick Links */}
      <div className="flex justify-center gap-4 mb-8">
        <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30">
          <Link href="/search/cities">
            <Globe className="mr-2 h-4 w-4" />
            Search Cities
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-4xl mx-auto mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
          <Input
            className="pl-12 h-14 text-lg rounded-full shadow-xl border-blue-200 focus:border-blue-400 focus:ring-blue-500/20"
            placeholder="Search activities, tours, experiences..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue="all" className="max-w-4xl mx-auto mb-8">
        <TabsList className="flex flex-wrap justify-center gap-2 h-auto p-2 bg-white/80 border border-blue-100">
          <TabsTrigger
            value="all"
            onClick={() => setCategory("all")}
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
          >
            All
          </TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              onClick={() => setCategory(cat)}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
            >
              {categoryIcons[cat] || <Star className="h-4 w-4" />}
              <span className="ml-2">{cat}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Filters */}
      <div className="max-w-4xl mx-auto mb-8 flex flex-wrap gap-4 items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border border-blue-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px] border-blue-200">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="cost">Lowest Price</SelectItem>
              <SelectItem value="duration">Shortest</SelectItem>
              <SelectItem value="name">A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Max Price: ${maxCost[0]}</span>
          <Slider
            value={maxCost}
            onValueChange={setMaxCost}
            max={500}
            min={0}
            step={10}
            className="w-[150px]"
          />
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[...Array(6)].map((_, i) => (
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
      ) : activities.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <Compass className="h-12 w-12 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-700">No activities found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto pb-24 md:pb-8">
          {activities.map((activity) => {
            const isAdded = addedActivities.has(activity.id)
            return (
              <Card key={activity.id} className="group overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 border-blue-100/50 hover:-translate-y-1">
                <CardHeader className="p-0">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={activity.image || "/placeholder.svg"}
                      alt={activity.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-blue-500/10" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/95 text-gray-700 border-0 shadow-lg">
                        {categoryIcons[activity.category]}
                        <span className="ml-1">{activity.category}</span>
                      </Badge>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg">
                        <DollarSign className="h-3 w-3" />
                        {activity.cost}
                      </Badge>
                    </div>

                    {/* Quick View Button */}
                    <button
                      onClick={() => handleOpenQuickView(activity)}
                      className="absolute bottom-3 right-3 p-2 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                    >
                      <Eye className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="p-4 bg-gradient-to-r from-white to-blue-50/30">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg line-clamp-1 text-gray-800">{activity.name}</CardTitle>
                    <div className="flex items-center gap-1 shrink-0 bg-amber-100 px-2 py-0.5 rounded-full">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                      <span className="font-medium text-sm text-amber-700">{activity.rating}</span>
                    </div>
                  </div>

                  {activity.city && (
                    <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                      <MapPin className="h-3 w-3 text-blue-400" />
                      {activity.city.name}, {activity.city.country}
                    </p>
                  )}

                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    {activity.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-blue-400" />
                      {formatDuration(activity.duration)}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 bg-gradient-to-r from-white to-blue-50/30 flex gap-2">
                  {isAdded ? (
                    <>
                      <Button
                        variant="outline"
                        className="flex-1 border-green-500 text-green-600"
                        disabled
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Added
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleRemoveFromTrip(activity.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
                      onClick={() => handleOpenAddDialog(activity)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add to Trip
                    </Button>
                  )}
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
              <Compass className="h-5 w-5 text-blue-500" />
              Add Activity to Trip
            </DialogTitle>
            <DialogDescription>
              Select a trip and stop to add "{selectedActivity?.name}".
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Trip</Label>
              <Select value={selectedTripId} onValueChange={(v) => { setSelectedTripId(v); setSelectedStopId(""); }}>
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

            {selectedTrip && selectedTrip.stops.length > 0 && (
              <div className="space-y-2">
                <Label>Select Stop (City)</Label>
                <Select value={selectedStopId} onValueChange={setSelectedStopId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a stop" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedTrip.stops.map(stop => (
                      <SelectItem key={stop.id} value={stop.id}>
                        {stop.city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedTrip && selectedTrip.stops.length === 0 && (
              <p className="text-sm text-amber-600">This trip has no stops yet. Add a city first!</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddToTrip}
              disabled={!selectedTripId || !selectedStopId}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick View Dialog */}
      <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              {quickViewActivity?.name}
            </DialogTitle>
          </DialogHeader>

          {quickViewActivity && (
            <div className="space-y-4">
              <div className="relative h-56 rounded-lg overflow-hidden">
                <Image
                  src={quickViewActivity.image || "/placeholder.svg"}
                  alt={quickViewActivity.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <Badge className="bg-white/95 text-gray-700">
                    {categoryIcons[quickViewActivity.category]}
                    <span className="ml-1">{quickViewActivity.category}</span>
                  </Badge>
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                    ${quickViewActivity.cost}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                {quickViewActivity.city && (
                  <p className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    {quickViewActivity.city.name}, {quickViewActivity.city.country}
                  </p>
                )}

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-600">{formatDuration(quickViewActivity.duration)}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-100 px-2 py-1 rounded-full">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="font-medium text-amber-700">{quickViewActivity.rating}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Description</h4>
                  <p className="text-gray-600">{quickViewActivity.description}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQuickViewOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (quickViewActivity) {
                  setIsQuickViewOpen(false)
                  handleOpenAddDialog(quickViewActivity)
                }
              }}
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

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  )
}
