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
        transactions: [],
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
        transactions: [],
        error: 'Database not available'
      }, { status: 503 })
    }

    const transactions = await db.transaction.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to last 50 transactions
    })

    return NextResponse.json({
      transactions
    })

  } catch (error) {
    console.error('Error fetching transactions:', error)
    
    // Check if it's a Prisma initialization error
    if (error instanceof Error && error.message.includes('PrismaClientInitializationError')) {
      return NextResponse.json({
        transactions: [],
        error: 'Database initialization failed'
      }, { status: 503 })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}