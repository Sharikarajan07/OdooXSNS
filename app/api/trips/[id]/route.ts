import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/trips/[id] - Get a single trip
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const trip = await prisma.trip.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, name: true, avatar: true },
                },
                stops: {
                    include: {
                        city: true,
                        activities: {
                            include: {
                                activity: true,
                                expenses: true,
                            },
                            orderBy: { orderIndex: 'asc' },
                        },
                    },
                    orderBy: { orderIndex: 'asc' },
                },
                expenses: true,
            },
        })

        if (!trip) {
            return NextResponse.json(
                { error: 'Trip not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ trip })
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

        const trip = await prisma.trip.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                totalBudget: data.totalBudget,
                coverImage: data.coverImage,
                status: data.status,
                isPublic: data.isPublic,
            },
            include: {
                stops: {
                    include: {
                        city: true,
                        activities: {
                            include: {
                                activity: true,
                            },
                        },
                    },
                },
            },
        })

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

        await prisma.trip.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete trip error:', error)
        return NextResponse.json(
            { error: 'Failed to delete trip' },
            { status: 500 }
        )
    }
}
