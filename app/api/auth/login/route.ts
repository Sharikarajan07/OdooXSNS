import { NextRequest, NextResponse } from 'next/server'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { mockUsers } from '@/lib/mock-data'

const JWT_SECRET = process.env.JWT_SECRET || 'globetrotter-secret-key-2026'

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        // Find user in mock data
        const user = mockUsers.find(u => u.email === email)

        if (!user) {
            // For demo purposes, create a temporary user if email looks valid
            if (email.includes('@')) {
                const token = jwt.sign(
                    { userId: 'demo-user', email },
                    JWT_SECRET,
                    { expiresIn: '7d' }
                )
                
                return NextResponse.json({
                    token,
                    user: {
                        id: 'demo-user',
                        email,
                        name: email.split('@')[0],
                        avatar: null,
                    },
                })
            }
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // For demo user, check password
        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            // For demo, accept 'demo123' or any password for testing
            if (password !== 'demo123' && email === 'demo@globetrotter.com') {
                return NextResponse.json(
                    { error: 'Invalid credentials' },
                    { status: 401 }
                )
            }
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
            },
        })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
