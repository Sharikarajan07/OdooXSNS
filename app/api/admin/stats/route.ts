import { NextResponse } from 'next/server'
import { getTrips, mockCities, mockActivities, mockUsers } from '@/lib/mock-data'

// GET /api/admin/stats - Get admin statistics
export async function GET() {
    try {
        const trips = getTrips()
        
        // Get total counts
        const totalUsers = mockUsers.length
        const totalTrips = trips.length
        const totalCities = mockCities.length
        const totalActivities = mockActivities.length

        // Get trips by status
        const tripsByStatus: Record<string, number> = {}
        trips.forEach(trip => {
            tripsByStatus[trip.status] = (tripsByStatus[trip.status] || 0) + 1
        })

        // Get recent trips
        const recentTrips = trips.slice(0, 5).map(trip => ({
            ...trip,
            user: { name: mockUsers[0].name, email: mockUsers[0].email }
        }))

        // Get popular cities
        const popularCities = mockCities
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 5)
            .map(city => ({
                ...city,
                _count: { stops: Math.floor(Math.random() * 10) + 1 }
            }))

        // Get top activities
        const topActivities = mockActivities
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5)
            .map(activity => ({
                ...activity,
                city: mockCities.find(c => c.id === activity.cityId) || { name: 'Unknown' },
                _count: { stopActivities: Math.floor(Math.random() * 20) + 5 }
            }))

        // Get users with most trips
        const topUsers = mockUsers.map(user => ({
            ...user,
            _count: { trips: trips.filter(t => t.userId === user.id).length }
        }))

        // Monthly trip trends (mock data for demo)
        const monthlyTrends = [
            { month: 'Jan', trips: 12, users: 8 },
            { month: 'Feb', trips: 19, users: 12 },
            { month: 'Mar', trips: 25, users: 18 },
            { month: 'Apr', trips: 32, users: 22 },
            { month: 'May', trips: 28, users: 20 },
            { month: 'Jun', trips: 35, users: 26 },
        ]

        return NextResponse.json({
            stats: {
                totalUsers,
                totalTrips,
                totalCities,
                totalActivities,
            },
            tripsByStatus,
            recentTrips,
            popularCities,
            topActivities,
            topUsers,
            monthlyTrends,
        })
    } catch (error) {
        console.error('Admin stats error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch admin statistics' },
            { status: 500 }
        )
    }
}
