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
        users: [],
        message: 'Build phase - no database access'
      })
    }
    
    const db = await getDb()
    
    if (!db) {
      return NextResponse.json({
        users: [],
        error: 'Database not available'
      }, { status: 503 })
    }

    const users = await db.user.findMany({
      include: {
        wallet: true,
        userPlans: {
          include: {
            plan: true
          }
        },
        transactions: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      users
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    
    // Check if it's a Prisma initialization error
    if (error instanceof Error && error.message.includes('PrismaClientInitializationError')) {
      return NextResponse.json({
        users: [],
        error: 'Database initialization failed'
      }, { status: 503 })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}