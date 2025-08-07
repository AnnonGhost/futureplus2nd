import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { planId, isActive } = await request.json()

    if (!planId || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'Plan ID and active status are required' },
        { status: 400 }
      )
    }

    const updatedPlan = await db.plan.update({
      where: { id: planId },
      data: { isActive }
    })

    return NextResponse.json({
      message: `Plan ${isActive ? 'activated' : 'deactivated'} successfully`,
      plan: updatedPlan
    })

  } catch (error) {
    console.error('Error toggling plan status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}