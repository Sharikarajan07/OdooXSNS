import { NextRequest, NextResponse } from 'next/server'
import { mockActivities } from '@/lib/mock-data'

// GET /api/activities - Get all activities with optional filters
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q')?.toLowerCase()
        const category = searchParams.get('category')
        const cityId = searchParams.get('cityId')
        const minCost = searchParams.get('minCost')
        const maxCost = searchParams.get('maxCost')
        const sortBy = searchParams.get('sortBy') || 'rating'

        let activities = [...mockActivities]

        // Filter by query
        if (query) {
            activities = activities.filter(a =>
                a.name.toLowerCase().includes(query) ||
                a.description.toLowerCase().includes(query) ||
                a.category.toLowerCase().includes(query)
            )
        }

        // Filter by category
        if (category && category !== 'all') {
            activities = activities.filter(a => a.category === category)
        }

        // Filter by city
        if (cityId) {
            activities = activities.filter(a => a.cityId === cityId)
        }

        // Filter by cost
        if (minCost) {
            activities = activities.filter(a => a.cost >= parseFloat(minCost))
        }
        if (maxCost) {
            activities = activities.filter(a => a.cost <= parseFloat(maxCost))
        }

        // Sort
        if (sortBy === 'rating') {
            activities.sort((a, b) => b.rating - a.rating)
        } else if (sortBy === 'cost') {
            activities.sort((a, b) => a.cost - b.cost)
        } else if (sortBy === 'duration') {
            activities.sort((a, b) => a.duration - b.duration)
        } else if (sortBy === 'name') {
            activities.sort((a, b) => a.name.localeCompare(b.name))
        }

        // Get unique categories for filtering
        const categories = [...new Set(mockActivities.map(a => a.category))]

        return NextResponse.json({
            activities,
            categories,
        })
    } catch (error) {
        console.error('Get activities error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch activities' },
            { status: 500 }
        )
    }
}
