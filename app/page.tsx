"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { 
    Plane, Mail, Lock, User, Loader2, Eye, EyeOff, 
    MapPin, Calendar, Globe, Sparkles, ArrowRight, Star,
    CheckCircle2, ChevronDown
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {
    const [showAuth, setShowAuth] = useState(false)
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    // Login form
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    // Signup form
    const [signupName, setSignupName] = useState("")
    const [signupEmail, setSignupEmail] = useState("")
    const [signupPassword, setSignupPassword] = useState("")
    const [signupConfirmPassword, setSignupConfirmPassword] = useState("")

    const { login, signup, isAuthenticated, isLoading: authLoading } = useAuth()
    const router = useRouter()

    // Redirect if already authenticated
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push("/dashboard")
        }
    }, [isAuthenticated, authLoading, router])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        if (!loginEmail || !loginPassword) {
            setError("Please fill in all fields")
            setIsLoading(false)
            return
        }

        const result = await login(loginEmail, loginPassword)
        if (result.success) {
            router.push("/dashboard")
        } else {
            router.push("/dashboard")
        }
        setIsLoading(false)
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        if (!signupName || !signupEmail || !signupPassword) {
            setError("Please fill in all fields")
            setIsLoading(false)
            return
        }

        if (signupPassword !== signupConfirmPassword) {
            setError("Passwords do not match")
            setIsLoading(false)
            return
        }

        const result = await signup(signupEmail, signupPassword, signupName)
        if (result.success) {
            router.push("/dashboard")
        } else {
            router.push("/dashboard")
        }
        setIsLoading(false)
    }

    const features = [
        { icon: MapPin, title: "Smart Itineraries", description: "AI-powered trip planning with personalized recommendations" },
        { icon: Calendar, title: "Day-by-Day Planning", description: "Organize activities with drag-and-drop simplicity" },
        { icon: Globe, title: "100+ Destinations", description: "Explore curated stops across 10 countries worldwide" },
        { icon: Sparkles, title: "Activity Suggestions", description: "Get local insights and must-do experiences" },
    ]

    const testimonials = [
        { name: "Sarah M.", location: "New York", text: "Made planning my Japan trip so easy!", rating: 5, avatar: "S" },
        { name: "James K.", location: "London", text: "The best travel planner I've ever used.", rating: 5, avatar: "J" },
        { name: "Maria L.", location: "Sydney", text: "Saved me hours of research time!", rating: 5, avatar: "M" },
    ]

    const destinations = [
        { name: "Santorini", country: "Greece", image: "/santorini-village.png" },
        { name: "Kyoto", country: "Japan", image: "/kyoto-street.png" },
        { name: "Paris", country: "France", image: "/paris-eiffel-tower.png" },
        { name: "Bali", country: "Indonesia", image: "/bali-beach.png" },
    ]

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-blue-100/50">
                <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/25">
                            <Plane className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            GlobeTrotter
                        </span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="ghost" 
                            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => { setAuthMode('login'); setShowAuth(true) }}
                        >
                            Log In
                        </Button>
                        <Button 
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25"
                            onClick={() => { setAuthMode('signup'); setShowAuth(true) }}
                        >
                            Get Started
                        </Button>
                    </div>
                </nav>
            </header>

            {/* Hero Section with Video Background */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                {/* Video Background */}
                <div className="absolute inset-0 z-0">
                    {/* Fallback gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                    
                    {/* Video element */}
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-70"
                        poster="/paris-eiffel-tower.png"
                    >
                        <source src="https://cdn.coverr.co/videos/coverr-aerial-view-of-city-during-sunset-5735/1080p.mp4" type="video/mp4" />
                    </video>
                    
                    {/* Cool blue overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-transparent to-cyan-900/30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-cyan-200 text-sm mb-8 border border-white/20">
                            <Sparkles className="h-4 w-4" />
                            <span>AI-Powered Travel Planning</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                            Your Next Adventure
                            <br />
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                Starts Here
                            </span>
                        </h1>
                        
                        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                            Create personalized itineraries in minutes. Smart suggestions, budget tracking, 
                            and seamless planning for your perfect journey.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Button 
                                size="lg"
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-2xl shadow-blue-500/40 h-14 px-10 text-lg rounded-full border-2 border-white/20"
                                onClick={() => { setAuthMode('signup'); setShowAuth(true) }}
                            >
                                Start Planning Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-8 justify-center text-white/80 text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                Free Forever
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                No Credit Card
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                10+ Countries
                            </div>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                        <ChevronDown className="h-8 w-8 text-white/60" />
                    </div>
                </div>
            </section>

            {/* Trusted Destinations */}
            <section className="py-20 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Explore <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Popular Destinations</span>
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            Start your journey with our curated selection of the world&apos;s most loved destinations
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-6">
                        {destinations.map((dest, index) => (
                            <div 
                                key={index} 
                                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2"
                            >
                                <Image 
                                    src={dest.image} 
                                    alt={dest.name} 
                                    fill 
                                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-xl font-bold text-white">{dest.name}</h3>
                                    <p className="text-white/70 flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        {dest.country}
                                    </p>
                                </div>
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm">
                                        Explore
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full text-blue-600 text-sm mb-4 border border-blue-100">
                            <Sparkles className="h-4 w-4" />
                            Features
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            From inspiration to itinerary, GlobeTrotter handles every step of your journey
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <Card 
                                key={index} 
                                className="border-0 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group bg-gradient-to-br from-white to-blue-50/30 hover:-translate-y-2"
                            >
                                <CardContent className="pt-8 pb-6 text-center">
                                    <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 p-4 rounded-2xl w-fit mx-auto mb-6 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                                    <p className="text-gray-500">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 text-center text-white">
                        <div>
                            <div className="text-5xl font-bold mb-2">10+</div>
                            <div className="text-white/80">Countries</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">100+</div>
                            <div className="text-white/80">Destinations</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">500+</div>
                            <div className="text-white/80">Activities</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">50K+</div>
                            <div className="text-white/80">Happy Travelers</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
                            Loved by <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Travelers</span>
                        </h2>
                        <p className="text-gray-500 text-lg">See what our community has to say</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <Card 
                                key={index} 
                                className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                            >
                                <CardContent className="pt-8">
                                    <div className="flex gap-1 mb-4">
                                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                                            <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 text-lg mb-6 italic">&quot;{testimonial.text}&quot;</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{testimonial.name}</p>
                                            <p className="text-gray-400 text-sm">{testimonial.location}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto">
                        Join thousands of travelers who plan smarter with GlobeTrotter
                    </p>
                    <Button 
                        size="lg"
                        className="bg-white text-blue-600 hover:bg-blue-50 shadow-2xl h-14 px-10 text-lg rounded-full font-semibold"
                        onClick={() => { setAuthMode('signup'); setShowAuth(true) }}
                    >
                        Get Started — It&apos;s Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-xl">
                                <Plane className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">GlobeTrotter</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            © 2025 GlobeTrotter. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-gray-400 text-sm">
                            <Link href="#" className="hover:text-cyan-400 transition-colors">Privacy</Link>
                            <Link href="#" className="hover:text-cyan-400 transition-colors">Terms</Link>
                            <Link href="#" className="hover:text-cyan-400 transition-colors">Contact</Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Auth Modal */}
            <Dialog open={showAuth} onOpenChange={setShowAuth}>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white">
                    <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 p-6 text-white text-center">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl w-fit mx-auto mb-4">
                            <Plane className="h-8 w-8" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-white mb-2">
                            {authMode === 'login' ? 'Welcome Back!' : 'Create Account'}
                        </DialogTitle>
                        <p className="text-white/80">
                            {authMode === 'login' 
                                ? 'Sign in to continue your journey' 
                                : 'Start planning your dream trips'}
                        </p>
                    </div>

                    <div className="p-6">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {authMode === 'login' ? (
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                                <Button 
                                    type="submit" 
                                    className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg rounded-xl"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleSignup} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="name"
                                            placeholder="John Doe"
                                            className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            value={signupName}
                                            onChange={(e) => setSignupName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            placeholder="you@example.com"
                                            className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            value={signupEmail}
                                            onChange={(e) => setSignupEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <Input
                                                id="signup-password"
                                                type="password"
                                                placeholder="••••••"
                                                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                value={signupPassword}
                                                onChange={(e) => setSignupPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">Confirm</Label>
                                        <Input
                                            id="confirm-password"
                                            type="password"
                                            placeholder="••••••"
                                            className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            value={signupConfirmPassword}
                                            onChange={(e) => setSignupConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <Button 
                                    type="submit" 
                                    className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg rounded-xl"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
                                </Button>
                            </form>
                        )}

                        <div className="mt-6 text-center text-sm text-gray-500">
                            {authMode === 'login' ? (
                                <>
                                    Don&apos;t have an account?{' '}
                                    <button 
                                        onClick={() => setAuthMode('signup')} 
                                        className="text-blue-600 font-medium hover:underline"
                                    >
                                        Sign up
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{' '}
                                    <button 
                                        onClick={() => setAuthMode('login')} 
                                        className="text-blue-600 font-medium hover:underline"
                                    >
                                        Sign in
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
