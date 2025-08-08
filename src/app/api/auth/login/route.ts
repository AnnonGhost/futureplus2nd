import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Build-safe API route - completely avoids Prisma imports during build time
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if we're in build phase or if Prisma is not available
    const isBuilding = process.env.NEXT_PHASE === 'phase-production-build' || 
                     process.env.VERCEL_ENV === 'production' && 
                     !process.env.DATABASE_URL
    
    if (isBuilding) {
      return NextResponse.json(
        { error: 'System maintenance - please try again later' },
        { status: 503 }
      )
    }

    // Dynamic import only when needed
    let db
    try {
      const { db: prismaDb } = await import('@/lib/db')
      db = prismaDb
    } catch (error) {
      console.error('Failed to import database client:', error)
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
      include: {
        wallet: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      )
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Login error:', error)
    
    // Check if it's a Prisma initialization error
    if (error instanceof Error && error.message.includes('PrismaClientInitializationError')) {
      return NextResponse.json(
        { error: 'Database initialization failed' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}