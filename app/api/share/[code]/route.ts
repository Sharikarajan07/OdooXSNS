import { NextRequest, NextResponse } from 'next/server'
import { getTripByShareCode, getTrips, addTrip, generateId, mockUsers, MockTrip } from '@/lib/mock-data'

// GET /api/share/[code] - Get a shared trip by share code
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params

        // Find trip by share code
        const allTrips = getTrips()
        const trip = allTrips.find(t => t.shareCode === code)

        if (!trip) {
            return NextResponse.json(
                { error: 'Shared trip not found' },
                { status: 404 }
            )
        }

        // Add user info
        const user = mockUsers[0]
        const tripWithUser = {
            ...trip,
            user: {
                name: user.name,
                avatar: user.avatar
            }
        }

        return NextResponse.json({ trip: tripWithUser })
    } catch (error) {
        console.error('Get shared trip error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch shared trip' },
            { status: 500 }
        )
    }
}

// POST /api/share/[code] - Copy a shared trip to user's account
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params
        const { userId } = await request.json()

        // Find the original trip
        const allTrips = getTrips()
        const originalTrip = allTrips.find(t => t.shareCode === code)

        if (!originalTrip) {
            return NextResponse.json(
                { error: 'Shared trip not found' },
                { status: 404 }
            )
        }

        // Create a copy of the trip
        const newTrip: MockTrip = {
            ...originalTrip,
            id: generateId(),
            userId: userId || 'user-1',
            name: `${originalTrip.name} (Copy)`,
            status: 'draft',
            shareCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
            stops: originalTrip.stops.map(stop => ({
                ...stop,
                id: generateId(),
                activities: stop.activities.map(act => ({
                    ...act,
                    id: generateId()
                }))
            }))
        }

        addTrip(newTrip)

        return NextResponse.json({ trip: newTrip }, { status: 201 })
    } catch (error) {
        console.error('Copy shared trip error:', error)
        return NextResponse.json(
            { error: 'Failed to copy trip' },
            { status: 500 }
        )
    }
}
