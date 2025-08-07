import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json()

    if (!key) {
      return NextResponse.json(
        { error: 'Admin key is required' },
        { status: 400 }
      )
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}