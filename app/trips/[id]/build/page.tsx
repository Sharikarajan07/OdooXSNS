"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTrip, type Activity } from "@/context/trip-context"
import { Plus, Trash2, Save, ArrowLeft, Calendar } from "lucide-react"

export default function BuildItineraryPage() {
  const { id } = useParams()
  const router = useRouter()
  const { trips, updateTrip } = useTrip()
  const [trip, setTrip] = useState(trips.find((t) => t.id === id))
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    const foundTrip = trips.find((t) => t.id === id)
    if (foundTrip) {
      setTrip(foundTrip)
      setActivities(
        foundTrip.activities.length > 0
          ? foundTrip.activities
          : [{ id: Math.random().toString(36).substr(2, 9), day: 1, name: "", cost: 0 }],
      )
    }
  }, [id, trips])

  if (!trip) return <div>Trip not found</div>

  const addActivity = () => {
    const lastDay = activities.length > 0 ? Math.max(...activities.map((a) => a.day)) : 0
    setActivities([...activities, { id: Math.random().toString(36).substr(2, 9), day: lastDay + 1, name: "", cost: 0 }])
  }

  const removeActivity = (id: string) => {
    setActivities(activities.filter((a) => a.id !== id))
  }

  const updateActivityField = (id: string, field: keyof Activity, value: string | number) => {
    setActivities(activities.map((a) => (a.id === id ? { ...a, [field]: value } : a)))
  }

  const handleSave = () => {
    const updatedTrip = { ...trip, activities }
    updateTrip(updatedTrip)
    router.push(`/trips/${trip.id}`)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          <Save className="mr-2 h-4 w-4" />
          Save Itinerary
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Build Itinerary: {trip.name}</h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-6">
        {activities.map((activity, index) => (
          <Card key={activity.id} className="relative overflow-hidden border-l-4 border-l-primary">
            <CardHeader className="py-4 px-6 bg-muted/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  Section / Day {activity.day}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeActivity(activity.id)}
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 grid gap-4 md:grid-cols-4">
              <div className="md:col-span-1 space-y-2">
                <Label>Day #</Label>
                <Input
                  type="number"
                  value={activity.day}
                  onChange={(e) => updateActivityField(activity.id, "day", Number.parseInt(e.target.value))}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Activity Name</Label>
                <Input
                  placeholder="e.g., Morning tour of the Louvre"
                  value={activity.name}
                  onChange={(e) => updateActivityField(activity.id, "name", e.target.value)}
                />
              </div>
              <div className="md:col-span-1 space-y-2">
                <Label>Estimated Cost ($)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={activity.cost}
                  onChange={(e) => updateActivityField(activity.id, "cost", Number.parseFloat(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          variant="outline"
          onClick={addActivity}
          className="w-full border-dashed border-2 py-8 flex flex-col gap-2 hover:bg-muted/50 transition-colors bg-transparent"
        >
          <Plus className="h-6 w-6 text-primary" />
          <span>Add Another Section</span>
        </Button>
      </div>
    </div>
  )
}
