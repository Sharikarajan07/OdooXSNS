import { NextRequest, NextResponse } from 'next/server'
import { getTripById, addStopToTrip, getCityById, generateId, MockStop } from '@/lib/mock-data'

// GET /api/stops - Get stops for a trip
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const tripId = searchParams.get('tripId')

        if (!tripId) {
            return NextResponse.json(
                { error: 'Trip ID is required' },
                { status: 400 }
            )
        }

        const trip = getTripById(tripId)
        const stops = trip?.stops || []

        return NextResponse.json({ stops })
    } catch (error) {
        console.error('Get stops error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch stops' },
            { status: 500 }
        )
    }
}

// POST /api/stops - Create a new stop
export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        const { tripId, cityId, arrivalDate, departureDate, notes } = data

        if (!tripId || !cityId || !arrivalDate || !departureDate) {
            return NextResponse.json(
                { error: 'Trip ID, city ID, and dates are required' },
                { status: 400 }
            )
        }

        const trip = getTripById(tripId)
        const city = getCityById(cityId)

        if (!trip || !city) {
            return NextResponse.json(
                { error: 'Trip or city not found' },
                { status: 404 }
            )
        }

        const orderIndex = trip.stops.length

        const stop: MockStop = {
            id: generateId(),
            tripId,
            cityId,
            arrivalDate,
            departureDate,
            orderIndex,
            notes: notes || '',
            city,
            activities: []
        }

        addStopToTrip(tripId, stop)

        return NextResponse.json({ stop }, { status: 201 })
    } catch (error) {
        console.error('Create stop error:', error)
        return NextResponse.json(
            { error: 'Failed to create stop' },
            { status: 500 }
        )
    }
}

// PUT /api/stops - Update stops order
export async function PUT(request: NextRequest) {
    try {
        const { stops } = await request.json()

        // In mock mode, just return success
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Update stops error:', error)
        return NextResponse.json(
            { error: 'Failed to update stops' },
            { status: 500 }
        )
    }
}

// DELETE /api/stops - Delete a stop
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const stopId = searchParams.get('id')

        if (!stopId) {
            return NextResponse.json(
                { error: 'Stop ID is required' },
                { status: 400 }
            )
        }

        // In mock mode, just return success
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete stop error:', error)
        return NextResponse.json(
            { error: 'Failed to delete stop' },
            { status: 500 }
        )
    }
}
