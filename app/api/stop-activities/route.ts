import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

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

        const activities = await prisma.stopActivity.findMany({
            where: { stopId },
            include: {
                activity: true,
            },
            orderBy: { orderIndex: 'asc' },
        })

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

        // Get the next order index
        const lastActivity = await prisma.stopActivity.findFirst({
            where: { stopId },
            orderBy: { orderIndex: 'desc' },
        })
        const orderIndex = (lastActivity?.orderIndex ?? -1) + 1

        const stopActivity = await prisma.stopActivity.create({
            data: {
                stopId,
                activityId,
                startTime: startTime ? new Date(startTime) : null,
                orderIndex,
                notes,
            },
            include: {
                activity: true,
            },
        })

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

        await prisma.stopActivity.delete({
            where: { id },
        })

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

        for (const activity of activities) {
            await prisma.stopActivity.update({
                where: { id: activity.id },
                data: { orderIndex: activity.orderIndex },
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Update stop activities error:', error)
        return NextResponse.json(
            { error: 'Failed to update activities' },
            { status: 500 }
        )
    }
}
