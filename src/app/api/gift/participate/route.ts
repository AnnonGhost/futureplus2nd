import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { giftId, userId } = await request.json()

    if (!giftId || !userId) {
      return NextResponse.json(
        { error: 'Gift ID and User ID are required' },
        { status: 400 }
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}