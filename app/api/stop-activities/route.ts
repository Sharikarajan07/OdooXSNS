import { NextRequest, NextResponse } from 'next/server'
import { getTrips, getActivityById, addActivityToStop, generateId, MockStopActivity } from '@/lib/mock-data'

// GET /api/stop-activities - Get activities for a stop
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const stopId = searchParams.get('stopId')

        if (!stopId) {
            return NextResponse.json(
                { error: 'Stop ID is required' },
                { status: 400 }
            )
        }

        // Find the stop across all trips
        const allTrips = getTrips()
        let activities: MockStopActivity[] = []
        for (const trip of allTrips) {
            const stop = trip.stops.find(s => s.id === stopId)
            if (stop) {
                activities = stop.activities
                break
            }
        }

        return NextResponse.json({ activities })
    } catch (error) {
        console.error('Get stop activities error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch activities' },
            { status: 500 }
        )
    }
}

// POST /api/stop-activities - Add an activity to a stop
export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        const { stopId, activityId, startTime, notes } = data

        if (!stopId || !activityId) {
            return NextResponse.json(
                { error: 'Stop ID and activity ID are required' },
                { status: 400 }
            )
        }

        const activity = getActivityById(activityId)
        if (!activity) {
            return NextResponse.json(
                { error: 'Activity not found' },
                { status: 404 }
            )
        }

        const stopActivity: MockStopActivity = {
            id: generateId(),
            stopId,
            activityId,
            startTime: startTime || null,
            orderIndex: 0,
            activity
        }

        addActivityToStop(stopId, stopActivity)

        return NextResponse.json({ stopActivity }, { status: 201 })
    } catch (error) {
        console.error('Add stop activity error:', error)
        return NextResponse.json(
            { error: 'Failed to add activity' },
            { status: 500 }
        )
    }
}

// DELETE /api/stop-activities - Remove an activity from a stop
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'Stop activity ID is required' },
                { status: 400 }
            )
        }

        // In mock mode, just return success
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete stop activity error:', error)
        return NextResponse.json(
            { error: 'Failed to delete activity' },
            { status: 500 }
        )
    }
}

// PUT /api/stop-activities - Update activity order
export async function PUT(request: NextRequest) {
    try {
        const { activities } = await request.json()

        // In mock mode, just return success
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Update stop activities error:', error)
        return NextResponse.json(
            { error: 'Failed to update activities' },
            { status: 500 }
        )
    }
}
