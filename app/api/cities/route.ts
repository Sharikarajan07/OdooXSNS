import { NextRequest, NextResponse } from 'next/server'
import { mockCities } from '@/lib/mock-data'

// GET /api/cities - Get all cities with optional search
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q')?.toLowerCase()
        const region = searchParams.get('region')
        const country = searchParams.get('country')
        const sortBy = searchParams.get('sortBy') || 'popularity'

        let cities = [...mockCities]

        // Filter by query
        if (query) {
            cities = cities.filter(c =>
                c.name.toLowerCase().includes(query) ||
                c.country.toLowerCase().includes(query) ||
                c.description.toLowerCase().includes(query)
            )
        }

        // Filter by region
        if (region && region !== 'all') {
            cities = cities.filter(c => c.region === region)
        }

        // Filter by country
        if (country) {
            cities = cities.filter(c => c.country === country)
        }

        // Sort
        if (sortBy === 'popularity') {
            cities.sort((a, b) => b.popularity - a.popularity)
        } else if (sortBy === 'costIndex') {
            cities.sort((a, b) => a.costIndex - b.costIndex)
        } else if (sortBy === 'name') {
            cities.sort((a, b) => a.name.localeCompare(b.name))
        }

        // Get unique regions for filtering
        const regions = [...new Set(mockCities.map(c => c.region))].filter(Boolean)

        return NextResponse.json({
            cities,
            regions,
        })
    } catch (error) {
        console.error('Get cities error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch cities' },
            { status: 500 }
        )
    }
}
