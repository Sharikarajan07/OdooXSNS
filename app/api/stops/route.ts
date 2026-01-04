import { NextRequest, NextResponse } from 'next/server'
import { getTripById, addStopToTrip, getCityById, generateId, MockStop, MockCity, mockCities, clearTripStops } from '@/lib/mock-data'

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

        const trip = getTripById(tripId)
        const stops = trip?.stops || []

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
        const { tripId, cityId, arrivalDate, departureDate, notes, cityName, cityCountry, cityImage } = data

        if (!tripId || !arrivalDate || !departureDate) {
            return NextResponse.json(
                { error: 'Trip ID and dates are required' },
                { status: 400 }
            )
        }

        const trip = getTripById(tripId)

        if (!trip) {
            return NextResponse.json(
                { error: 'Trip not found' },
                { status: 404 }
            )
        }

        // Try to find existing city, or create a dynamic one
        let city = getCityById(cityId)
        
        if (!city && cityName) {
            // Check if city with same name exists
            city = mockCities.find(c => c.name.toLowerCase() === cityName.toLowerCase())
            
            if (!city) {
                // Create a new city dynamically
                city = {
                    id: cityId || generateId(),
                    name: cityName,
                    country: cityCountry || 'Unknown',
                    region: 'Travel',
                    image: cityImage || '/beautiful-travel-destination-landscape.jpg',
                    description: `Beautiful destination in ${cityCountry || 'the world'}`,
                    costIndex: 50,
                    popularity: 50
                }
                // Add to mock cities for future reference
                mockCities.push(city)
            }
        }

        if (!city) {
            return NextResponse.json(
                { error: 'City not found and no city data provided' },
                { status: 404 }
            )
        }

        const orderIndex = trip.stops.length

        const stop: MockStop = {
            id: generateId(),
            tripId,
            cityId: city.id,
            arrivalDate,
            departureDate,
            orderIndex,
            notes: notes || '',
            city,
            activities: []
        }

        addStopToTrip(tripId, stop)

        return NextResponse.json({ stop }, { status: 201 })
    } catch (error) {
        console.error('Create stop error:', error)
        return NextResponse.json(
            { error: 'Failed to create stop' },
            { status: 500 }
        )
    }
}

// PUT /api/stops - Update stops order or clear trip stops
export async function PUT(request: NextRequest) {
    try {
        const data = await request.json()
        const { stops, tripId, clearAll } = data

        // If clearAll is true, remove all stops from the trip
        if (clearAll && tripId) {
            clearTripStops(tripId)
            return NextResponse.json({ success: true, message: 'All stops cleared' })
        }

        // In mock mode, just return success for reordering
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

        // In mock mode, just return success
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete stop error:', error)
        return NextResponse.json(
            { error: 'Failed to delete stop' },
            { status: 500 }
        )
    }
}
