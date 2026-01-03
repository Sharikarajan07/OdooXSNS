import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/admin/stats - Get admin statistics
export async function GET() {
    try {
        // Get total counts
        const [totalUsers, totalTrips, totalCities, totalActivities] = await Promise.all([
            prisma.user.count(),
            prisma.trip.count(),
            prisma.city.count(),
            prisma.activity.count(),
        ])

        // Get trips by status
        const tripsByStatus = await prisma.trip.groupBy({
            by: ['status'],
            _count: true,
        })

        // Get recent trips
        const recentTrips = await prisma.trip.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, email: true },
                },
                stops: {
                    include: { city: true },
                },
            },
        })

        // Get popular cities (by number of stops)
        const popularCities = await prisma.city.findMany({
            take: 5,
            orderBy: { popularity: 'desc' },
            include: {
                _count: {
                    select: { stops: true },
                },
            },
        })

        // Get top activities
        const topActivities = await prisma.activity.findMany({
            take: 5,
            orderBy: { rating: 'desc' },
            include: {
                city: true,
                _count: {
                    select: { stopActivities: true },
                },
            },
        })

        // Get users with most trips
        const topUsers = await prisma.user.findMany({
            take: 5,
            include: {
                _count: {
                    select: { trips: true },
                },
            },
            orderBy: {
                trips: {
                    _count: 'desc',
                },
            },
        })

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
            tripsByStatus: tripsByStatus.reduce((acc, item) => {
                acc[item.status] = item._count
                return acc
            }, {} as Record<string, number>),
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
