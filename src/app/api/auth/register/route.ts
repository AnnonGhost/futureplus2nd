import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { name, email, mobile, password } = await request.json()

    if (!name || !email || !mobile || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email },
          { mobile }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or mobile already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with wallet
    const user = await db.user.create({
      data: {
        name,
        email,
        mobile,
        password: hashedPassword,
        wallet: {
          create: {
            balance: 0,
            bonus: 0
          }
        }
      },
      include: {
        wallet: true
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Registration successful',
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}