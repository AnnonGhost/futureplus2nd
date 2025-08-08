import { NextRequest, NextResponse } from 'next/server'

// Build-safe API route - completely avoids Prisma imports during build time
export async function POST(request: NextRequest) {
  try {
    const { giftId, userId } = await request.json()

    if (!giftId || !userId) {
      return NextResponse.json(
        { error: 'Gift ID and User ID are required' },
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

    // Check if gift exists and is active
    const gift = await db.gift.findUnique({
      where: { id: giftId }
    })

    if (!gift) {
      return NextResponse.json(
        { error: 'Gift not found' },
        { status: 404 }
      )
    }

    if (gift.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Gift is not active' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // For this demo, we'll just return a success response
    // In a real app, you would create a participation record and potentially select a winner
    
    return NextResponse.json({
      message: 'Participation successful',
      participationId: `part_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    })

  } catch (error) {
    console.error('Participation error:', error)
    
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