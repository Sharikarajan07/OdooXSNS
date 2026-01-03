import { NextRequest, NextResponse } from 'next/server'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { mockUsers, generateId } from '@/lib/mock-data'

const JWT_SECRET = process.env.JWT_SECRET || 'globetrotter-secret-key-2026'

// In-memory user store for demo
const registeredUsers = [...mockUsers]

export async function POST(request: NextRequest) {
    try {
        const { email, password, name } = await request.json()

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Email, password, and name are required' },
                { status: 400 }
            )
        }

        // Check if user exists in mock data
        const existingUser = registeredUsers.find(u => u.email === email)

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user in memory
        const newUser = {
            id: generateId(),
            email,
            password: hashedPassword,
            name,
            avatar: null,
            language: 'en'
        }
        registeredUsers.push(newUser)

        // Generate token
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        return NextResponse.json({
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                avatar: newUser.avatar,
            },
        }, { status: 201 })
    } catch (error) {
        console.error('Signup error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
