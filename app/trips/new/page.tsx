"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTrip } from "@/context/trip-context"
import { ArrowLeft, MapPin, CalendarIcon } from "lucide-react"
import Link from "next/link"

export default function NewTripPage() {
  const router = useRouter()
  const { addTrip, setCurrentTrip } = useTrip()
  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newTrip = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      activities: [],
      status: "upcoming" as const,
    }

    addTrip(newTrip)
    setCurrentTrip(newTrip)
    router.push(`/trips/${newTrip.id}/build`)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Plan a New Adventure</CardTitle>
          <CardDescription>Tell us where and when you're going to start building your itinerary.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Trip Name</Label>
              <Input
                id="name"
                placeholder="e.g., European Summer Tour"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="destination"
                  className="pl-10"
                  placeholder="e.g., Paris, France"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startDate"
                    type="date"
                    className="pl-10"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endDate"
                    type="date"
                    className="pl-10"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full h-12 text-lg">
              Start Building Itinerary
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
