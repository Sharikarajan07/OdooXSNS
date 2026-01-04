"use client"

import { useState, useRef } from "react"
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
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Form states
    const [name, setName] = useState(user?.name || "John Traveler")
    const [email, setEmail] = useState(user?.email || "demo@globetrotter.com")
    const [language, setLanguage] = useState("en")
    const [notifications, setNotifications] = useState(true)
    const [publicProfile, setPublicProfile] = useState(false)
    const [profileImage, setProfileImage] = useState<string | null>(user?.avatar || null)

    // Handle image selection from device
    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file')
                return
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB')
                return
            }
            // Create a preview URL
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfileImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    // Trigger file input click
    const handleCameraClick = () => {
        fileInputRef.current?.click()
    }

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
        <div className="container mx-auto py-8 px-4 max-w-4xl bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 min-h-screen pb-24 md:pb-8">
            <Button variant="ghost" asChild className="mb-6 hover:bg-blue-50 hover:text-blue-600">
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
            </Button>

            <div className="space-y-8">
                {/* Profile Header */}
                <Card className="border-blue-100/50 shadow-xl shadow-blue-500/5">
                    <CardHeader className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
                        <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">Profile Settings</CardTitle>
                        <CardDescription>
                            Manage your account information and preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        {/* Avatar Section */}
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                {/* Hidden file input */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageSelect}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <Avatar className="h-24 w-24 ring-4 ring-blue-200 ring-offset-2">
                                    <AvatarImage src={profileImage || "/placeholder-user.jpg"} />
                                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                                        {name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <button 
                                    onClick={handleCameraClick}
                                    className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                                    title="Choose profile picture"
                                >
                                    <Camera className="h-4 w-4" />
                                </button>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
                                <p className="text-gray-500">{email}</p>
                                <p className="text-sm text-gray-400 mt-1">Member since January 2026</p>
                                <p className="text-xs text-blue-500 mt-1 cursor-pointer hover:underline" onClick={handleCameraClick}>
                                    Click camera icon to change photo
                                </p>
                            </div>
                        </div>

                        <Separator className="bg-blue-100" />

                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold flex items-center gap-2">
                                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                                    <User className="h-4 w-4 text-white" />
                                </div>
                                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Personal Information</span>
                            </h4>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your name"
                                        className="border-blue-100 focus:border-blue-300 focus:ring-blue-500/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            className="pl-10 border-blue-100 focus:border-blue-300 focus:ring-blue-500/20"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-blue-100" />

                        {/* Preferences */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold flex items-center gap-2">
                                <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
                                    <Globe className="h-4 w-4 text-white" />
                                </div>
                                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Preferences</span>
                            </h4>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="language">Language</Label>
                                    <Select value={language} onValueChange={setLanguage}>
                                        <SelectTrigger className="border-rose-100">
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
                                        <SelectTrigger className="border-rose-100">
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

                            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg">
                                        <Bell className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">Email Notifications</p>
                                        <p className="text-sm text-gray-500">Receive trip reminders and updates</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={notifications}
                                    onCheckedChange={setNotifications}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg">
                                        <Shield className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">Public Profile</p>
                                        <p className="text-sm text-gray-500">Allow others to see your trips</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={publicProfile}
                                    onCheckedChange={setPublicProfile}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-gradient-to-r from-blue-50/30 to-cyan-50/30">
                        <Button onClick={handleSave} disabled={isSaving} className="ml-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30">
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
                <Card className="border-blue-100/50 shadow-lg shadow-blue-500/5">
                    <CardHeader className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
                        <CardTitle className="flex items-center gap-2">
                            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                                <MapPin className="h-4 w-4 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Saved Destinations</span>
                        </CardTitle>
                        <CardDescription>
                            Places you've saved for future trips
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="grid gap-4 sm:grid-cols-3">
                            {savedDestinations.map((dest) => (
                                <div
                                    key={dest.id}
                                    className="group relative h-32 rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-blue-500/10 z-10" />
                                    <div
                                        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
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
                <Card className="border-rose-200 bg-rose-50/30">
                    <CardHeader>
                        <CardTitle className="text-rose-600 flex items-center gap-2">
                            <Trash2 className="h-5 w-5" />
                            Danger Zone
                        </CardTitle>
                        <CardDescription>
                            Irreversible account actions
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg border border-rose-300 bg-rose-50">
                            <div>
                                <p className="font-medium text-rose-700">Delete Account</p>
                                <p className="text-sm text-rose-500">
                                    Permanently delete your account and all data
                                </p>
                            </div>
                            <Button className="bg-rose-600 hover:bg-rose-700 text-white" size="sm" onClick={handleDeleteAccount}>
                                Delete Account
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border border-rose-100 bg-white">
                            <div>
                                <p className="font-medium text-gray-700">Sign Out</p>
                                <p className="text-sm text-gray-500">
                                    Sign out of your account on this device
                                </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleLogout} className="border-rose-200 hover:bg-rose-50 hover:text-rose-600">
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
