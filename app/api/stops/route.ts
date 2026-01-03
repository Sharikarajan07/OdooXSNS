import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

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

        const stops = await prisma.stop.findMany({
            where: { tripId },
            include: {
                city: true,
                activities: {
                    include: {
                        activity: true,
                    },
                    orderBy: { orderIndex: 'asc' },
                },
            },
            orderBy: { orderIndex: 'asc' },
        })

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

        // Get the next order index
        const lastStop = await prisma.stop.findFirst({
            where: { tripId },
            orderBy: { orderIndex: 'desc' },
        })
        const orderIndex = (lastStop?.orderIndex ?? -1) + 1

        const stop = await prisma.stop.create({
            data: {
                tripId,
                cityId,
                arrivalDate: new Date(arrivalDate),
                departureDate: new Date(departureDate),
                orderIndex,
                notes,
            },
            include: {
                city: true,
                activities: {
                    include: {
                        activity: true,
                    },
                },
            },
        })

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

        // Update each stop's order
        for (const stop of stops) {
            await prisma.stop.update({
                where: { id: stop.id },
                data: { orderIndex: stop.orderIndex },
            })
        }

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

        await prisma.stop.delete({
            where: { id: stopId },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete stop error:', error)
        return NextResponse.json(
            { error: 'Failed to delete stop' },
            { status: 500 }
        )
    }
}
