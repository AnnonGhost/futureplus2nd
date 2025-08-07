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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}