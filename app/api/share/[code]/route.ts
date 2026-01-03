import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/share/[code] - Get a shared trip by share code
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params

        const trip = await prisma.trip.findUnique({
            where: { shareCode: code },
            include: {
                user: {
                    select: { name: true, avatar: true },
                },
                stops: {
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
                },
                expenses: {
                    select: {
                        category: true,
                        amount: true,
                    },
                },
            },
        })

        if (!trip) {
            return NextResponse.json(
                { error: 'Shared trip not found' },
                { status: 404 }
            )
        }

        // Only return public trips or trips with a valid share code
        if (!trip.isPublic && !trip.shareCode) {
            return NextResponse.json(
                { error: 'This trip is not shared' },
                { status: 403 }
            )
        }

        return NextResponse.json({ trip })
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
        const originalTrip = await prisma.trip.findUnique({
            where: { shareCode: code },
            include: {
                stops: {
                    include: {
                        activities: true,
                    },
                },
            },
        })

        if (!originalTrip) {
            return NextResponse.json(
                { error: 'Shared trip not found' },
                { status: 404 }
            )
        }

        // Get the target user (or demo user)
        const targetUserId = userId || (await prisma.user.findFirst())?.id

        if (!targetUserId) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 401 }
            )
        }

        // Create a copy of the trip
        const newTrip = await prisma.trip.create({
            data: {
                userId: targetUserId,
                name: `${originalTrip.name} (Copy)`,
                description: originalTrip.description,
                coverImage: originalTrip.coverImage,
                startDate: originalTrip.startDate,
                endDate: originalTrip.endDate,
                totalBudget: originalTrip.totalBudget,
                status: 'draft',
                shareCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
            },
        })

        // Copy stops and activities
        for (const stop of originalTrip.stops) {
            const newStop = await prisma.stop.create({
                data: {
                    tripId: newTrip.id,
                    cityId: stop.cityId,
                    arrivalDate: stop.arrivalDate,
                    departureDate: stop.departureDate,
                    orderIndex: stop.orderIndex,
                    notes: stop.notes,
                },
            })

            // Copy stop activities
            for (const activity of stop.activities) {
                await prisma.stopActivity.create({
                    data: {
                        stopId: newStop.id,
                        activityId: activity.activityId,
                        startTime: activity.startTime,
                        orderIndex: activity.orderIndex,
                        customCost: activity.customCost,
                        notes: activity.notes,
                    },
                })
            }
        }

        return NextResponse.json({ trip: newTrip }, { status: 201 })
    } catch (error) {
        console.error('Copy shared trip error:', error)
        return NextResponse.json(
            { error: 'Failed to copy trip' },
            { status: 500 }
        )
    }
}
