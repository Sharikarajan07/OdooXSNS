"use client"

import { useTrip } from "@/context/trip-context"
import { mockTrips } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CalendarPage() {
  const { trips } = useTrip()
  const allTrips = [...trips, ...mockTrips]

  // Static Calendar UI for hackathon demo
  const daysInMonth = 31
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // Simple check if a day is part of a trip for highlighting
  const isTripDay = (day: number) => {
    // Demo highlighting for March 2026 (Paris trip)
    return day >= 10 && day <= 17
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Trip Calendar</h1>
        <p className="text-muted-foreground">Visualize your travel schedule across the year.</p>
      </div>

      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle className="text-xl">March 2026</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b bg-muted/30 text-center py-2 text-sm font-medium">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {/* Empty slots for start of month */}
            {Array.from({ length: 0 }).map((_, i) => (
              <div key={i} className="h-24 md:h-32 border-b border-r p-2 bg-muted/5"></div>
            ))}

            {days.map((day) => (
              <div
                key={day}
                className={`h-24 md:h-32 border-b border-r p-2 relative transition-colors ${
                  isTripDay(day) ? "bg-primary/10" : "hover:bg-muted/10"
                }`}
              >
                <span className={`text-sm font-medium ${isTripDay(day) ? "text-primary" : "text-muted-foreground"}`}>
                  {day}
                </span>

                {day === 10 && (
                  <div className="absolute top-8 left-2 right-2 bg-primary text-primary-foreground text-[10px] md:text-xs p-1 rounded-md shadow-sm truncate z-10">
                    <Plane className="h-3 w-3 inline mr-1" /> Paris Getaway
                  </div>
                )}
                {day > 10 && day <= 17 && (
                  <div className="absolute top-8 left-0 right-0 bg-primary/40 h-5 md:h-6 -mx-[1px]"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 grid gap-4 max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold">Trips in View</h3>
        {allTrips
          .filter((t) => t.id === "2")
          .map((trip) => (
            <div key={trip.id} className="flex items-center gap-4 p-4 border rounded-lg bg-card shadow-sm">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Plane className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold">{trip.name}</p>
                <p className="text-sm text-muted-foreground">{trip.destination} • Mar 10 - Mar 17, 2026</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
