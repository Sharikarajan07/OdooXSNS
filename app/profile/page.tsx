"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context"
import {
    ArrowLeft,
    User,
    Mail,
    Globe,
    Bell,
    Shield,
    Trash2,
    LogOut,
    Camera,
    MapPin,
    Save,
    Loader2
} from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
    const { user, logout } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Form states
    const [name, setName] = useState(user?.name || "John Traveler")
    const [email, setEmail] = useState(user?.email || "demo@globetrotter.com")
    const [language, setLanguage] = useState("en")
    const [notifications, setNotifications] = useState(true)
    const [publicProfile, setPublicProfile] = useState(false)

    // Saved destinations (mock data)
    const savedDestinations = [
        { id: 1, name: "Paris, France", image: "/paris-eiffel-tower.png" },
        { id: 2, name: "Tokyo, Japan", image: "/kyoto-street.png" },
        { id: 3, name: "Bali, Indonesia", image: "/bali-beach.png" },
    ]

    const handleSave = async () => {
        setIsSaving(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSaving(false)
        alert("Profile saved successfully!")
    }

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    const handleDeleteAccount = () => {
        if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            logout()
            router.push("/")
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <Button variant="ghost" asChild className="mb-6">
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
            </Button>

            <div className="space-y-8">
                {/* Profile Header */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Profile Settings</CardTitle>
                        <CardDescription>
                            Manage your account information and preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Avatar Section */}
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <Avatar className="h-24 w-24 border-4 border-primary/20">
                                    <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} />
                                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                        {name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors">
                                    <Camera className="h-4 w-4" />
                                </button>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">{name}</h3>
                                <p className="text-muted-foreground">{email}</p>
                                <p className="text-sm text-muted-foreground mt-1">Member since January 2026</p>
                            </div>
                        </div>

                        <Separator />

                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Personal Information
                            </h4>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            className="pl-10"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Preferences */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary" />
                                Preferences
                            </h4>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="language">Language</Label>
                                    <Select value={language} onValueChange={setLanguage}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="es">Español</SelectItem>
                                            <SelectItem value="fr">Français</SelectItem>
                                            <SelectItem value="de">Deutsch</SelectItem>
                                            <SelectItem value="ja">日本語</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="currency">Currency</Label>
                                    <Select defaultValue="usd">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="usd">USD ($)</SelectItem>
                                            <SelectItem value="eur">EUR (€)</SelectItem>
                                            <SelectItem value="gbp">GBP (£)</SelectItem>
                                            <SelectItem value="jpy">JPY (¥)</SelectItem>
                                            <SelectItem value="inr">INR (₹)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <Bell className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="font-medium">Email Notifications</p>
                                        <p className="text-sm text-muted-foreground">Receive trip reminders and updates</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={notifications}
                                    onCheckedChange={setNotifications}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <Shield className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="font-medium">Public Profile</p>
                                        <p className="text-sm text-muted-foreground">Allow others to see your trips</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={publicProfile}
                                    onCheckedChange={setPublicProfile}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSave} disabled={isSaving} className="ml-auto">
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Saved Destinations */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            Saved Destinations
                        </CardTitle>
                        <CardDescription>
                            Places you've saved for future trips
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-3">
                            {savedDestinations.map((dest) => (
                                <div
                                    key={dest.id}
                                    className="group relative h-32 rounded-lg overflow-hidden cursor-pointer"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                                    <div
                                        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                                        style={{ backgroundImage: `url(${dest.image})` }}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                                        <p className="text-white font-medium text-sm">{dest.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle className="text-destructive flex items-center gap-2">
                            <Trash2 className="h-5 w-5" />
                            Danger Zone
                        </CardTitle>
                        <CardDescription>
                            Irreversible account actions
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                            <div>
                                <p className="font-medium">Delete Account</p>
                                <p className="text-sm text-muted-foreground">
                                    Permanently delete your account and all data
                                </p>
                            </div>
                            <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                                Delete Account
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                            <div>
                                <p className="font-medium">Sign Out</p>
                                <p className="text-sm text-muted-foreground">
                                    Sign out of your account on this device
                                </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
