import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { planId, name, description, price, duration, dailyReturn, isActive } = await request.json()

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = price
    if (duration !== undefined) updateData.duration = duration
    if (dailyReturn !== undefined) updateData.dailyReturn = dailyReturn
    if (isActive !== undefined) updateData.isActive = isActive

    const updatedPlan = await db.plan.update({
      where: { id: planId },
      data: updateData
    })

    return NextResponse.json({
      message: 'Plan updated successfully',
      plan: updatedPlan
    })

  } catch (error) {
    console.error('Error updating plan:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}