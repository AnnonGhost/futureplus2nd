import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Build-safe API route - completely avoids Prisma imports during build time
export async function POST(request: NextRequest) {
  try {
    // Check if we're in build phase or if Prisma is not available
    const isBuilding = process.env.NEXT_PHASE === 'phase-production-build' || 
                     process.env.VERCEL_ENV === 'production' && 
                     !process.env.DATABASE_URL
    
    if (isBuilding) {
      return NextResponse.json({
        error: 'System maintenance - please try again later'
      }, { status: 503 })
    }
    
    const { key } = await request.json()

    if (!key) {
      return NextResponse.json(
        { error: 'Admin key is required' },
        { status: 400 }
      )
    }

    // Dynamic import only when needed
    let db
    try {
      const { db: prismaDb } = await import('@/lib/db')
      db = prismaDb
    } catch (error) {
      console.error('Failed to import database client:', error)
      return NextResponse.json({
        error: 'Database not available'
      }, { status: 503 })
    }

    // Find admin by key
    const admin = await db.admin.findUnique({
      where: { key }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid admin key' },
        { status: 401 }
      )
    }

    if (!admin.isActive) {
      return NextResponse.json(
        { error: 'Admin account is deactivated' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      message: 'Admin login successful',
      admin: {
        id: admin.id,
        email: admin.email,
        isActive: admin.isActive
      }
    })

  } catch (error) {
    console.error('Admin login error:', error)
    
    // Check if it's a Prisma initialization error
    if (error instanceof Error && error.message.includes('PrismaClientInitializationError')) {
      return NextResponse.json({
        error: 'Database initialization failed'
      }, { status: 503 })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}