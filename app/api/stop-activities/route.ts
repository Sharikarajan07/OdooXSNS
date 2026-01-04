import { NextRequest, NextResponse } from 'next/server'
import { getTrips, getActivityById, addActivityToStop, generateId, MockStopActivity, MockActivity, mockActivities } from '@/lib/mock-data'

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
        const { stopId, activityId, startTime, dayIndex, notes, activityName, activityCategory, activityCost, activityDuration } = data

        if (!stopId) {
            return NextResponse.json(
                { error: 'Stop ID is required' },
                { status: 400 }
            )
        }

        // Try to find existing activity, or create a dynamic one
        let activity = getActivityById(activityId)
        
        if (!activity && activityName) {
            // Check if activity with same name exists
            activity = mockActivities.find(a => a.name.toLowerCase() === activityName.toLowerCase())
            
            if (!activity) {
                // Create a new activity dynamically
                activity = {
                    id: activityId || generateId(),
                    cityId: null,
                    name: activityName,
                    category: activityCategory || 'Culture',
                    description: `Activity: ${activityName}`,
                    image: '/beautiful-travel-destination-landscape.jpg',
                    cost: activityCost || 0,
                    duration: activityDuration || 120,
                    rating: 4.5
                }
                // Add to mock activities for future reference
                mockActivities.push(activity)
            }
        }

        if (!activity) {
            return NextResponse.json(
                { error: 'Activity not found and no activity data provided' },
                { status: 404 }
            )
        }

        const stopActivity: MockStopActivity = {
            id: generateId(),
            stopId,
            activityId: activity.id,
            startTime: startTime || null,
            orderIndex: 0,
            dayIndex: dayIndex ?? 0,
            activity
        }

        const result = addActivityToStop(stopId, stopActivity)
        
        if (!result) {
            return NextResponse.json(
                { error: 'Stop not found' },
                { status: 404 }
            )
        }

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
