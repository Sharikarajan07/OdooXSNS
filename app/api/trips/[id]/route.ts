import { NextRequest, NextResponse } from 'next/server'
import { getTripById, updateTrip, deleteTrip, mockUsers } from '@/lib/mock-data'

// GET /api/trips/[id] - Get a single trip
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const trip = getTripById(id)

        if (!trip) {
            return NextResponse.json(
                { error: 'Trip not found' },
                { status: 404 }
            )
        }

        // Add user info
        const user = mockUsers[0]
        const tripWithUser = {
            ...trip,
            user: {
                id: user.id,
                name: user.name,
                avatar: user.avatar
            }
        }

        return NextResponse.json({ trip: tripWithUser })
    } catch (error) {
        console.error('Get trip error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch trip' },
            { status: 500 }
        )
    }
}

// PUT /api/trips/[id] - Update a trip
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const data = await request.json()

        const trip = updateTrip(id, {
            name: data.name,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            totalBudget: data.totalBudget,
            coverImage: data.coverImage,
            status: data.status,
            isPublic: data.isPublic,
        })

        if (!trip) {
            return NextResponse.json(
                { error: 'Trip not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ trip })
    } catch (error) {
        console.error('Update trip error:', error)
        return NextResponse.json(
            { error: 'Failed to update trip' },
            { status: 500 }
        )
    }
}

// DELETE /api/trips/[id] - Delete a trip
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const success = deleteTrip(id)

        if (!success) {
            return NextResponse.json(
                { error: 'Trip not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete trip error:', error)
        return NextResponse.json(
            { error: 'Failed to delete trip' },
            { status: 500 }
        )
    }
}
