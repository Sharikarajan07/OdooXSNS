"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Plane,
  Calendar,
  DollarSign,
  MapPin,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  Check
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface City {
  id: string
  name: string
  country: string
  image: string
  costIndex: number
}

const coverImages = [
  "/beautiful-travel-destination-landscape.jpg",
  "/paris-eiffel-tower.png",
  "/santorini-village.png",
  "/bali-beach.png",
  "/kyoto-street.png",
  "/machu-picchu-ancient-city.png"
]

export default function NewTripPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [cities, setCities] = useState<City[]>([])

  // Form states
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [budget, setBudget] = useState("")
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [coverImage, setCoverImage] = useState(coverImages[0])

  useEffect(() => {
    fetchCities()
  }, [])

  const fetchCities = async () => {
    try {
      const res = await fetch('/api/cities')
      const data = await res.json()
      setCities(data.cities || [])
    } catch (error) {
      console.error('Error fetching cities:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !startDate || !endDate) {
      alert("Please fill in required fields")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          startDate,
          endDate,
          totalBudget: parseFloat(budget) || 0,
          coverImage,
          destination: selectedCities.join(', '),
        }),
      })

      const data = await res.json()

      if (res.ok && data.trip) {
        router.push(`/trips/${data.trip.id}/build`)
      } else {
        alert(data.error || 'Failed to create trip')
      }
    } catch (error) {
      console.error('Error creating trip:', error)
      alert('Failed to create trip')
    }

    setIsLoading(false)
  }

  const toggleCity = (cityId: string) => {
    setSelectedCities(prev =>
      prev.includes(cityId)
        ? prev.filter(id => id !== cityId)
        : [...prev, cityId]
    )
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl pb-24 md:pb-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/trips">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Trips
        </Link>
      </Button>

      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-primary/10 rounded-2xl">
            <Plane className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">Plan a New Trip</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Start planning your next adventure! Fill in the details below to create your personalized itinerary.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Trip Details
              </CardTitle>
              <CardDescription>
                Give your trip a name and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Trip Name *</Label>
                <Input
                  id="name"
                  placeholder="Summer in Europe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="A two-week adventure exploring the best of European culture..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Dates and Budget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Dates & Budget
              </CardTitle>
              <CardDescription>
                When are you traveling and what's your budget?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    min={today}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    min={startDate || today}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Budget (USD)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="3000"
                  min="0"
                  step="100"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  We'll help you track expenses against this budget
                </p>
              </div>

              {startDate && endDate && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm">
                    <span className="font-medium">Trip Duration:</span>{' '}
                    {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    {budget && (
                      <span className="text-muted-foreground">
                        {' '}• ~${(parseFloat(budget) / Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)))).toFixed(0)}/day
                      </span>
                    )}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Destinations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Destinations
              </CardTitle>
              <CardDescription>
                Select cities you plan to visit (you can add more later)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {cities.slice(0, 8).map((city) => {
                  const isSelected = selectedCities.includes(city.id)
                  return (
                    <button
                      key={city.id}
                      type="button"
                      className={`
                        relative p-3 rounded-lg border-2 text-left transition-all
                        ${isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                        }
                      `}
                      onClick={() => toggleCity(city.id)}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                      <div className="relative h-16 w-full rounded mb-2 overflow-hidden">
                        <Image
                          src={city.image || "/placeholder.svg"}
                          alt={city.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="font-medium text-sm truncate">{city.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{city.country}</p>
                    </button>
                  )
                })}
              </div>

              {selectedCities.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Selected:</span>
                  {selectedCities.map(id => {
                    const city = cities.find(c => c.id === id)
                    return city ? (
                      <Badge key={id} variant="secondary">
                        {city.name}
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cover Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Cover Image
              </CardTitle>
              <CardDescription>
                Choose a cover image for your trip
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {coverImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`
                      relative aspect-video rounded-lg overflow-hidden border-2 transition-all
                      ${coverImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-border'}
                    `}
                    onClick={() => setCoverImage(img)}
                  >
                    <Image
                      src={img}
                      alt={`Cover option ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    {coverImage === img && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <Check className="h-6 w-6 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Ready to start planning?</h3>
                  <p className="text-sm text-muted-foreground">
                    You can add details and activities after creating your trip
                  </p>
                </div>
                <Button type="submit" size="lg" disabled={isLoading} className="shrink-0">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plane className="mr-2 h-4 w-4" />
                      Create Trip
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
