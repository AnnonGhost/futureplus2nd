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
      // Return basic referral data during build phase
      const referralCode = `FP${userId.slice(-6).toUpperCase()}`
      const referralLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://futureplus.vercel.app'}?ref=${referralCode}`
      
      return NextResponse.json({
        referrals: [],
        referralCode,
        referralLink,
        message: 'Build phase - limited data'
      })
    }

    // Dynamic import only when needed
    let db
    try {
      const { db: prismaDb } = await import('@/lib/db')
      db = prismaDb
    } catch (error) {
      console.error('Failed to import database client:', error)
      
      // Return basic referral data even if DB is not available
      const referralCode = `FP${userId.slice(-6).toUpperCase()}`
      const referralLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://futureplus.vercel.app'}?ref=${referralCode}`
      
      return NextResponse.json({
        referrals: [],
        referralCode,
        referralLink,
        error: 'Database not available'
      }, { status: 503 })
    }

    // Fetch user's referrals
    const referrals = await db.referral.findMany({
      where: { referrerId: userId },
      include: {
        referred: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Generate referral code and link
    const referralCode = `FP${userId.slice(-6).toUpperCase()}`
    const referralLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://futureplus.vercel.app'}?ref=${referralCode}`

    return NextResponse.json({
      referrals,
      referralCode,
      referralLink
    })

  } catch (error) {
    console.error('Error fetching referral data:', error)
    
    // Check if it's a Prisma initialization error
    if (error instanceof Error && error.message.includes('PrismaClientInitializationError')) {
      const { searchParams } = new URL(request.url)
      const userId = searchParams.get('userId')
      const referralCode = `FP${userId?.slice(-6).toUpperCase() || 'DEMO'}`
      const referralLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://futureplus.vercel.app'}?ref=${referralCode}`
      
      return NextResponse.json({
        referrals: [],
        referralCode,
        referralLink,
        error: 'Database initialization failed'
      }, { status: 503 })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}