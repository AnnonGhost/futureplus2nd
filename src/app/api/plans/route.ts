import { NextResponse } from 'next/server'

// Dynamic import to handle Vercel build-time issues
async function getDb() {
  try {
    const { db } = await import('@/lib/db')
    return db
  } catch (error) {
    console.error('Failed to import database client:', error)
    return null
  }
}

export async function GET() {
  try {
    // Check if we're in build phase
    const isBuilding = process.env.NEXT_PHASE === 'phase-production-build'
    
    if (isBuilding) {
      // Return empty data during build phase
      return NextResponse.json({
        plans: [],
        message: 'Build phase - no database access'
      })
    }
    
    const db = await getDb()
    
    if (!db) {
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