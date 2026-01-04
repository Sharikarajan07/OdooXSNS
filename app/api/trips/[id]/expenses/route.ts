import { NextRequest, NextResponse } from 'next/server'
import { addExpenseToTrip, removeExpenseFromTrip, getTripById } from '@/lib/mock-data'

// POST /api/trips/[id]/expenses - Add a new expense
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const data = await request.json()

        const expense = addExpenseToTrip(id, {
            category: data.category,
            amount: data.amount,
            description: data.description || '',
        })

        if (!expense) {
            return NextResponse.json(
                { error: 'Trip not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ expense })
    } catch (error) {
        console.error('Add expense error:', error)
        return NextResponse.json(
            { error: 'Failed to add expense' },
            { status: 500 }
        )
    }
}

// DELETE /api/trips/[id]/expenses - Delete an expense
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { searchParams } = new URL(request.url)
        const expenseId = searchParams.get('expenseId')

        if (!expenseId) {
            return NextResponse.json(
                { error: 'Expense ID is required' },
                { status: 400 }
            )
        }

        const success = removeExpenseFromTrip(id, expenseId)

        if (!success) {
            return NextResponse.json(
                { error: 'Expense not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete expense error:', error)
        return NextResponse.json(
            { error: 'Failed to delete expense' },
            { status: 500 }
        )
    }
}

// GET /api/trips/[id]/expenses - Get all expenses for a trip
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const trip = getTripById(id)

        if (!trip) {
            return NextResponse.json(
                { error: 'Trip not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ expenses: trip.expenses })
    } catch (error) {
        console.error('Get expenses error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch expenses' },
            { status: 500 }
        )
    }
}
