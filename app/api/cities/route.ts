import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/cities - Get all cities with optional search
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q')
        const region = searchParams.get('region')
        const country = searchParams.get('country')
        const sortBy = searchParams.get('sortBy') || 'popularity'

        const where: Record<string, unknown> = {}

        if (query) {
            where.OR = [
                { name: { contains: query } },
                { country: { contains: query } },
                { description: { contains: query } },
            ]
        }

        if (region) {
            where.region = region
        }

        if (country) {
            where.country = country
        }

        const orderBy: Record<string, string> = {}
        if (sortBy === 'popularity') {
            orderBy.popularity = 'desc'
        } else if (sortBy === 'costIndex') {
            orderBy.costIndex = 'asc'
        } else if (sortBy === 'name') {
            orderBy.name = 'asc'
        }

        const cities = await prisma.city.findMany({
            where,
            orderBy,
            include: {
                activities: {
                    take: 5,
                },
                _count: {
                    select: { stops: true },
                },
            },
        })

        // Get unique regions for filtering
        const regions = await prisma.city.findMany({
            select: { region: true },
            distinct: ['region'],
        })

        return NextResponse.json({
            cities,
            regions: regions.map(r => r.region).filter(Boolean),
        })
    } catch (error) {
        console.error('Get cities error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch cities' },
            { status: 500 }
        )
    }
}
