import { NextResponse } from 'next/server'

// Build-safe API route - completely avoids Prisma imports during build time
export async function GET() {
  try {
    // Check if we're in build phase or if Prisma is not available
    const isBuilding = process.env.NEXT_PHASE === 'phase-production-build' || 
                     process.env.VERCEL_ENV === 'production' && 
                     !process.env.DATABASE_URL
    
    if (isBuilding) {
      // Return empty data during build phase
      return NextResponse.json({
        gifts: [],
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
        gifts: [],
        error: 'Database not available'
      }, { status: 503 })
    }

    const gifts = await db.gift.findMany({
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

    return NextResponse.json({
      gifts
    })

  } catch (error) {
    console.error('Error fetching gifts:', error)
    
    // Check if it's a Prisma initialization error
    if (error instanceof Error && error.message.includes('PrismaClientInitializationError')) {
      return NextResponse.json({
        gifts: [],
        error: 'Database initialization failed'
      }, { status: 503 })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}