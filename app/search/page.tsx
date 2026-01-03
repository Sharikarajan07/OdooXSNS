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
  Globe
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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

  useEffect(() => {
    fetchActivities()
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

  const handleAddToTrip = (activityId: string) => {
    setAddedActivities(prev => new Set(prev).add(activityId))
    // In a real app, this would add to the current trip context
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Compass className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Discover Experiences</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find amazing activities, tours, and experiences to add to your trip.
        </p>
      </div>

      {/* Quick Links */}
      <div className="flex justify-center gap-4 mb-8">
        <Button variant="outline" asChild>
          <Link href="/search/cities">
            <Globe className="mr-2 h-4 w-4" />
            Search Cities
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-4xl mx-auto mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            className="pl-12 h-14 text-lg rounded-full shadow-lg border-primary/20"
            placeholder="Search activities, tours, experiences..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue="all" className="max-w-4xl mx-auto mb-8">
        <TabsList className="flex flex-wrap justify-center gap-2 h-auto p-2 bg-muted/50">
          <TabsTrigger
            value="all"
            onClick={() => setCategory("all")}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All
          </TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              onClick={() => setCategory(cat)}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {categoryIcons[cat] || <Star className="h-4 w-4" />}
              <span className="ml-2">{cat}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Filters */}
      <div className="max-w-4xl mx-auto mb-8 flex flex-wrap gap-4 items-center justify-between p-4 rounded-xl bg-muted/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
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
          <span className="text-sm text-muted-foreground">Max Price: ${maxCost[0]}</span>
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
          <Compass className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No activities found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {activities.map((activity) => {
            const isAdded = addedActivities.has(activity.id)
            return (
              <Card key={activity.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                <CardHeader className="p-0">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={activity.image || "/placeholder.svg"}
                      alt={activity.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-white/90 text-foreground">
                        {categoryIcons[activity.category]}
                        <span className="ml-1">{activity.category}</span>
                      </Badge>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary text-primary-foreground">
                        <DollarSign className="h-3 w-3" />
                        {activity.cost}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg line-clamp-1">{activity.name}</CardTitle>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium text-sm">{activity.rating}</span>
                    </div>
                  </div>

                  {activity.city && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                      <MapPin className="h-3 w-3" />
                      {activity.city.name}, {activity.city.country}
                    </p>
                  )}

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {activity.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDuration(activity.duration)}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full transition-colors"
                    variant={isAdded ? "secondary" : "default"}
                    onClick={() => handleAddToTrip(activity.id)}
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
