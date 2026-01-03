"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useTrip } from "@/context/trip-context"
import { ArrowLeft, Edit2, Calendar, MapPin, DollarSign, Clock, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { mockTrips } from "@/lib/mock-data"

export default function TripDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { trips } = useTrip()

  // Look in context first, then mock data for demo purposes
  const trip = trips.find((t) => t.id === id) || mockTrips.find((t) => t.id === id)

  if (!trip) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Trip not found</h1>
        <Button asChild>
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    )
  }

  const totalCost = trip.activities.reduce((sum, activity) => sum + activity.cost, 0)

  // Group activities by day
  const groupedActivities = trip.activities.reduce(
    (acc, activity) => {
      if (!acc[activity.day]) {
        acc[activity.day] = []
      }
      acc[activity.day].push(activity)
      return acc
    },
    {} as Record<number, typeof trip.activities>,
  )

  const sortedDays = Object.keys(groupedActivities)
    .map(Number)
    .sort((a, b) => a - b)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Button variant="ghost" asChild className="mb-2 -ml-2">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-4xl font-bold text-foreground">{trip.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {trip.destination}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className={`h-4 w-4 ${trip.status === "completed" ? "text-green-500" : "text-blue-500"}`} />
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </span>
          </div>
        </div>
        <Button asChild>
          <Link href={`/trips/${trip.id}/build`}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Itinerary
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Itinerary View */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            Timeline
          </h2>

          {sortedDays.length > 0 ? (
            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              {sortedDays.map((day) => (
                <div
                  key={day}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-primary bg-background text-primary font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    {day}
                  </div>
                  {/* Content */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-xl font-bold mb-4">Day {day}</h3>
                    <div className="space-y-4">
                      {groupedActivities[day].map((activity) => (
                        <div
                          key={activity.id}
                          className="flex justify-between items-start border-b border-border pb-2 last:border-0 last:pb-0"
                        >
                          <div>
                            <p className="font-medium text-foreground">{activity.name}</p>
                            <p className="text-sm text-muted-foreground">${activity.cost.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-10 text-center text-muted-foreground">
                No activities planned yet.
                <Button variant="link" asChild className="block mt-2">
                  <Link href={`/trips/${trip.id}/build`}>Start building your itinerary</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Budget Summary & Details */}
        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Budget Summary
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">Estimated trip expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">${totalCost.toFixed(2)}</div>
              <p className="text-sm text-primary-foreground/70">
                Total calculated cost for {trip.activities.length} activities
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sortedDays.map((day) => {
                const dayTotal = groupedActivities[day].reduce((sum, a) => sum + a.cost, 0)
                return (
                  <div key={day} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Day {day}</span>
                    <span className="font-medium">${dayTotal.toFixed(2)}</span>
                  </div>
                )
              })}
              <div className="pt-4 border-t border-border flex justify-between items-center font-bold">
                <span>Total</span>
                <span>${totalCost.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 border-none">
            <CardContent className="p-4 text-xs text-muted-foreground">
              Tip: Stay on budget by tracking small expenses like local transport and snacks between major activities!
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
