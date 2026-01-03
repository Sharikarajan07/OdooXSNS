"use client"

import { useState, Suspense } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { activities } from "@/lib/mock-data"
import { Search, MapPin, Plus, Star } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

function SearchContent() {
  const [query, setQuery] = useState("")

  const filtered = activities.filter(
    (a) => a.name.toLowerCase().includes(query.toLowerCase()) || a.city.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Discover Experiences</h1>
        <p className="text-muted-foreground mb-8">Search for cities, museums, food tours, and more.</p>

        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            className="pl-12 h-14 text-lg rounded-full shadow-lg border-primary/20"
            placeholder="Where do you want to go?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((activity) => (
          <Card key={activity.id} className="group overflow-hidden">
            <CardHeader className="p-0">
              <div className="h-40 bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                  <Star className="h-12 w-12" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-xl">{activity.name}</CardTitle>
                <span className="font-bold text-primary">${activity.cost}</span>
              </div>
              <p className="text-muted-foreground flex items-center gap-1 text-sm">
                <MapPin className="h-3 w-3" /> {activity.city}
              </p>
            </CardContent>
            <CardFooter className="p-5 pt-0">
              <Button
                variant="outline"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
              >
                <Plus className="mr-2 h-4 w-4" /> Add to Trip
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
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
