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
        plans: [],
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
        plans: [],
        error: 'Database not available'
      }, { status: 503 })
    }

    const plans = await db.plan.findMany({
      orderBy: {
        price: 'asc'
      }
    })

    return NextResponse.json({
      plans
    })

  } catch (error) {
    console.error('Error fetching plans:', error)
    
    // Check if it's a Prisma initialization error
    if (error instanceof Error && error.message.includes('PrismaClientInitializationError')) {
      return NextResponse.json({
        plans: [],
        error: 'Database initialization failed'
      }, { status: 503 })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}