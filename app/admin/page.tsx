"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Users,
    Map,
    Globe,
    Activity,
    TrendingUp,
    ArrowLeft,
    Search,
    MoreHorizontal,
    Eye,
    Trash2,
    Calendar,
    DollarSign,
    Star,
    BarChart3
} from "lucide-react"
import Link from "next/link"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Area,
    AreaChart
} from "recharts"

const COLORS = ['#3b82f6', '#06b6d4', '#14b8a6', '#10b981', '#8b5cf6']

interface AdminStats {
    stats: {
        totalUsers: number
        totalTrips: number
        totalCities: number
        totalActivities: number
    }
    tripsByStatus: Record<string, number>
    recentTrips: Array<{
        id: string
        name: string
        status: string
        createdAt: string
        user: { name: string; email: string }
        stops: Array<{ city: { name: string } }>
    }>
    popularCities: Array<{
        id: string
        name: string
        country: string
        popularity: number
        _count: { stops: number }
    }>
    topActivities: Array<{
        id: string
        name: string
        category: string
        rating: number
        city: { name: string }
        _count: { stopActivities: number }
    }>
    topUsers: Array<{
        id: string
        name: string
        email: string
        _count: { trips: number }
    }>
    monthlyTrends: Array<{
        month: string
        trips: number
        users: number
    }>
}

export default function AdminPage() {
    const [data, setData] = useState<AdminStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/admin/stats')
            const stats = await res.json()
            setData(stats)
        } catch (error) {
            console.error('Error fetching admin stats:', error)
        }
        setIsLoading(false)
    }

    const tripStatusData = data ? [
        { name: 'Upcoming', value: data.tripsByStatus.upcoming || 0 },
        { name: 'Ongoing', value: data.tripsByStatus.ongoing || 0 },
        { name: 'Completed', value: data.tripsByStatus.completed || 0 },
        { name: 'Draft', value: data.tripsByStatus.draft || 0 },
    ] : []

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 min-h-screen">
                <div className="animate-pulse space-y-8">
                    <div className="h-8 bg-blue-100 rounded w-1/4" />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-blue-50 rounded" />
                        ))}
                    </div>
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="h-80 bg-blue-50 rounded" />
                        <div className="h-80 bg-blue-50 rounded" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 min-h-screen pb-24 md:pb-8">
            <Button variant="ghost" asChild className="mb-6 hover:bg-blue-50 hover:text-blue-600">
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
            </Button>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">Admin Dashboard</h1>
                    <p className="text-gray-500">Monitor platform usage and analytics</p>
                </div>
                <Badge className="w-fit bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
                    <Activity className="mr-2 h-4 w-4" />
                    Live Data
                </Badge>
            </div>

            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white shadow-xl shadow-blue-500/30">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-blue-100">
                            <Users className="h-4 w-4" />
                            Total Users
                        </CardDescription>
                        <CardTitle className="text-3xl text-white">{data?.stats.totalUsers || 0}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-blue-100 flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            +12% this month
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-cyan-500 to-teal-500 border-0 text-white shadow-xl shadow-cyan-500/30">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-cyan-100">
                            <Map className="h-4 w-4" />
                            Total Trips
                        </CardDescription>
                        <CardTitle className="text-3xl text-white">{data?.stats.totalTrips || 0}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-cyan-100 flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            +8% this month
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-500 to-teal-500 border-0 text-white shadow-xl shadow-emerald-500/30">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-emerald-100">
                            <Globe className="h-4 w-4" />
                            Cities
                        </CardDescription>
                        <CardTitle className="text-3xl text-white">{data?.stats.totalCities || 0}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-emerald-100">Available destinations</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-violet-500 to-purple-500 border-0 text-white shadow-xl shadow-violet-500/30">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-violet-100">
                            <Activity className="h-4 w-4" />
                            Activities
                        </CardDescription>
                        <CardTitle className="text-3xl text-white">{data?.stats.totalActivities || 0}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Bookable experiences</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Monthly Trends */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            User & Trip Trends
                        </CardTitle>
                        <CardDescription>Monthly growth over the past 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.monthlyTrends || []}>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="trips"
                                        name="Trips"
                                        stroke="#06b6d4"
                                        fill="#06b6d4"
                                        fillOpacity={0.3}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        name="Users"
                                        stroke="#3b82f6"
                                        fill="#3b82f6"
                                        fillOpacity={0.3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Trip Status Pie */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Trip Status Distribution
                        </CardTitle>
                        <CardDescription>Breakdown of trip statuses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={tripStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {tripStatusData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs for Tables */}
            <Tabs defaultValue="trips" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="trips">Recent Trips</TabsTrigger>
                    <TabsTrigger value="cities">Popular Cities</TabsTrigger>
                    <TabsTrigger value="users">Top Users</TabsTrigger>
                </TabsList>

                <TabsContent value="trips">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Recent Trips</CardTitle>
                                <div className="relative w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search trips..."
                                        className="pl-10"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Trip Name</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Destinations</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data?.recentTrips.map((trip) => (
                                        <TableRow key={trip.id}>
                                            <TableCell className="font-medium">{trip.name}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarFallback className="text-xs">
                                                            {trip.user.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm">{trip.user.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {trip.stops.map(s => s.city.name).join(', ') || 'None'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    trip.status === 'completed' ? 'default' :
                                                        trip.status === 'upcoming' ? 'secondary' : 'outline'
                                                }>
                                                    {trip.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(trip.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="cities">
                    <Card>
                        <CardHeader>
                            <CardTitle>Popular Cities</CardTitle>
                            <CardDescription>Most visited destinations on the platform</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>City</TableHead>
                                        <TableHead>Country</TableHead>
                                        <TableHead>Popularity Score</TableHead>
                                        <TableHead>Total Visits</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data?.popularCities.map((city, index) => (
                                        <TableRow key={city.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                        {index + 1}
                                                    </div>
                                                    {city.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>{city.country}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary rounded-full"
                                                            style={{ width: `${city.popularity}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm">{city.popularity}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{city._count.stops}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Users</CardTitle>
                            <CardDescription>Users with the most trips created</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Total Trips</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data?.topUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{user.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{user._count.trips} trips</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
