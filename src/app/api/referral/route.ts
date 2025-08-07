import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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

    // Generate referral code and link (simplified for demo)
    const referralCode = `FP${userId.slice(-6).toUpperCase()}`
    const referralLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://futureplus.vercel.app'}?ref=${referralCode}`

    return NextResponse.json({
      referrals,
      referralCode,
      referralLink
    })

  } catch (error) {
    console.error('Error fetching referral data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}