import { NextRequest, NextResponse } from 'next/server'

// Build-safe API route - completely avoids Prisma imports during build time
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if we're in build phase or if Prisma is not available
    const isBuilding = process.env.NEXT_PHASE === 'phase-production-build' || 
                     process.env.VERCEL_ENV === 'production' && 
                     !process.env.DATABASE_URL
    
    if (isBuilding) {
      // Return empty data during build phase
      return NextResponse.json({
        participations: [],
        message: 'Build phase - no database access'
      })
    }

    // Dynamic import only when needed
    let db
    try {
      const { db: prismaDb } = await import('@/lib/db')
      db = prismaDb
    } catch (error) {
      console.error('Failed to import database client:', error)
      return NextResponse.json({
        participations: [],
        error: 'Database not available'
      }, { status: 503 })
    }

    // This is a simplified implementation - in a real app, you'd have a GiftParticipation model
    // For now, we'll return the user's created gifts and won gifts as participations
    const participations = await db.gift.findMany({
      where: {
        OR: [
          { userId: userId },
          { winnerId: userId }
        ]
      },
      include: {
        winner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to look like participations
    const transformedParticipations = participations.map(gift => ({
      id: gift.id,
      giftId: gift.id,
      gift: {
        name: gift.name,
        type: gift.type,
        value: gift.value
      },
      status: gift.winnerId === userId ? 'WON' : 'PARTICIPATED',
      createdAt: gift.createdAt
    }))

    return NextResponse.json({
      participations: transformedParticipations
    })

  } catch (error) {
    console.error('Error fetching user participations:', error)
    
    // Check if it's a Prisma initialization error
    if (error instanceof Error && error.message.includes('PrismaClientInitializationError')) {
      return NextResponse.json({
        participations: [],
        error: 'Database initialization failed'
      }, { status: 503 })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}