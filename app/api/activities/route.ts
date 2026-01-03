import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/activities - Get all activities with optional filters
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q')
        const category = searchParams.get('category')
        const cityId = searchParams.get('cityId')
        const minCost = searchParams.get('minCost')
        const maxCost = searchParams.get('maxCost')
        const sortBy = searchParams.get('sortBy') || 'rating'

        const where: Record<string, unknown> = {}

        if (query) {
            where.OR = [
                { name: { contains: query } },
                { description: { contains: query } },
                { category: { contains: query } },
            ]
        }

        if (category) {
            where.category = category
        }

        if (cityId) {
            where.cityId = cityId
        }

        if (minCost || maxCost) {
            where.cost = {}
            if (minCost) {
                (where.cost as Record<string, number>).gte = parseFloat(minCost)
            }
            if (maxCost) {
                (where.cost as Record<string, number>).lte = parseFloat(maxCost)
            }
        }

        const orderBy: Record<string, string> = {}
        if (sortBy === 'rating') {
            orderBy.rating = 'desc'
        } else if (sortBy === 'cost') {
            orderBy.cost = 'asc'
        } else if (sortBy === 'duration') {
            orderBy.duration = 'asc'
        } else if (sortBy === 'name') {
            orderBy.name = 'asc'
        }

        const activities = await prisma.activity.findMany({
            where,
            orderBy,
            include: {
                city: true,
            },
        })

        // Get unique categories for filtering
        const categories = await prisma.activity.findMany({
            select: { category: true },
            distinct: ['category'],
        })

        return NextResponse.json({
            activities,
            categories: categories.map(c => c.category),
        })
    } catch (error) {
        console.error('Get activities error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch activities' },
            { status: 500 }
        )
    }
}
