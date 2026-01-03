"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useTrip } from "@/context/trip-context"
import { Plane } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useTrip()
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple mock authentication
    login()
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Plane className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome to GlobeTrotter</CardTitle>
          <CardDescription>Enter your credentials to start planning your next adventure</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="traveler_joy"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
