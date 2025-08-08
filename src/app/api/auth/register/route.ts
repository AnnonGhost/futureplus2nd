import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Build-safe API route - completely avoids Prisma imports during build time
export async function POST(request: NextRequest) {
  try {
    const { name, email, mobile, password } = await request.json()

    if (!name || !email || !mobile || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
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