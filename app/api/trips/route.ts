import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import * as jwt from 'jsonwebtoken'

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

        // For demo purposes, if no auth, return demo user's trips
        const userId = user?.userId || (await prisma.user.findFirst())?.id

        if (!userId) {
            return NextResponse.json({ trips: [] })
        }

        const trips = await prisma.trip.findMany({
            where: { userId },
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
                    orderBy: { orderIndex: 'asc' },
                },
                expenses: true,
            },
            orderBy: { startDate: 'asc' },
        })

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
        const userId = user?.userId || (await prisma.user.findFirst())?.id

        if (!userId) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 401 }
            )
        }

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

        const trip = await prisma.trip.create({
            data: {
                userId,
                name,
                description: description || destination || '',
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                totalBudget: totalBudget || 0,
                coverImage,
                shareCode,
                status: 'upcoming',
            },
            include: {
                stops: {
                    include: {
                        city: true,
                    },
                },
            },
        })

        return NextResponse.json({ trip }, { status: 201 })
    } catch (error) {
        console.error('Create trip error:', error)
        return NextResponse.json(
            { error: 'Failed to create trip' },
            { status: 500 }
        )
    }
}
