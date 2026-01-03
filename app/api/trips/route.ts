import { NextRequest, NextResponse } from 'next/server'
import * as jwt from 'jsonwebtoken'
import { getTrips, addTrip, generateId, MockTrip, mockUsers } from '@/lib/mock-data'

const JWT_SECRET = process.env.JWT_SECRET || 'globetrotter-secret-key-2026'

// Helper to get user from token
function getUserFromToken(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
        return null
    }

    const token = authHeader.substring(7)
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
    } catch {
        return null
    }
}

// GET /api/trips - Get all trips for the authenticated user
export async function GET(request: NextRequest) {
    try {
        const user = getUserFromToken(request)

        // For demo purposes, return all trips from mock data
        const userId = user?.userId || mockUsers[0]?.id || 'user-1'

        const allTrips = getTrips()
        const userTrips = allTrips.filter(t => t.userId === userId || userId === 'user-1' || userId === 'demo-user')

        // Transform to match expected format
        const trips = userTrips.map(trip => ({
            ...trip,
            startDate: trip.startDate,
            endDate: trip.endDate,
        }))

        return NextResponse.json({ trips })
    } catch (error) {
        console.error('Get trips error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch trips' },
            { status: 500 }
        )
    }
}

// POST /api/trips - Create a new trip
export async function POST(request: NextRequest) {
    try {
        const user = getUserFromToken(request)
        const userId = user?.userId || 'user-1'

        const data = await request.json()
        const { name, description, startDate, endDate, totalBudget, coverImage, destination } = data

        if (!name || !startDate || !endDate) {
            return NextResponse.json(
                { error: 'Name, start date, and end date are required' },
                { status: 400 }
            )
        }

        // Generate a share code
        const shareCode = Math.random().toString(36).substring(2, 10).toUpperCase()

        const newTrip: MockTrip = {
            id: generateId(),
            userId,
            name,
            description: description || destination || '',
            coverImage: coverImage || '/beautiful-travel-destination-landscape.jpg',
            startDate,
            endDate,
            totalBudget: totalBudget || 0,
            status: 'upcoming',
            isPublic: false,
            shareCode,
            stops: [],
            expenses: []
        }

        addTrip(newTrip)

        return NextResponse.json({ trip: newTrip }, { status: 201 })
    } catch (error) {
        console.error('Create trip error:', error)
        return NextResponse.json(
            { error: 'Failed to create trip' },
            { status: 500 }
        )
    }
}
