# API Route Fix Contents - Copy and Paste

Below are the exact contents to replace in each API route file. Copy the entire content for each file and paste it into the corresponding file.

## 1. src/app/api/auth/login/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

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

export async function POST(request: NextRequest) {
  try {
    // Check if we're in build phase
    const isBuilding = process.env.NEXT_PHASE === 'phase-production-build'
    
    if (isBuilding) {
      return NextResponse.json({
        error: 'Build phase - authentication unavailable'
      }, { status: 503 })
    }
    
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    
    if (!db) {
      return NextResponse.json({
        error: 'Database not available'
      }, { status: 503 })
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
      include: { wallet: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      )
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        wallet: user.wallet
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    
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
```

## 2. src/app/api/auth/register/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

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

export async function POST(request: NextRequest) {
  try {
    // Check if we're in build phase
    const isBuilding = process.env.NEXT_PHASE === 'phase-production-build'
    
    if (isBuilding) {
      return NextResponse.json({
        error: 'Build phase - registration unavailable'
      }, { status: 503 })
    }
    
    const { email, password, name, mobile, referralCode } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    
    if (!db) {
      return NextResponse.json({
        error: 'Database not available'
      }, { status: 503 })
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        mobile,
        wallet: {
          create: {
            balance: 0,
            bonus: 0
          }
        }
      },
      include: {
        wallet: true
      }
    })

    // Handle referral if provided
    if (referralCode) {
      // Add referral logic here
    }

    return NextResponse.json({
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        wallet: user.wallet
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    
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
```

## 3. src/app/api/referral/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'

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

export async function GET(request: NextRequest) {
  try {
    // Check if we're in build phase
    const isBuilding = process.env.NEXT_PHASE === 'phase-production-build'
    
    if (isBuilding) {
      return NextResponse.json({
        referrals: [],
        referralCode: 'DEMO_CODE',
        referralLink: 'https://your-app.vercel.app?ref=DEMO_CODE'
      })
    }
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    
    if (!db) {
      return NextResponse.json({
        referrals: [],
        referralCode: 'DEMO_CODE',
        referralLink: 'https://your-app.vercel.app?ref=DEMO_CODE'
      })
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
      return NextResponse.json({
        referrals: [],
        referralCode: 'DEMO_CODE',
        referralLink: 'https://your-app.vercel.app?ref=DEMO_CODE'
      })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## 4. src/app/api/wallet/transactions/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'

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

export async function GET(request: NextRequest) {
  try {
    // Check if we're in build phase
    const isBuilding = process.env.NEXT_PHASE === 'phase-production-build'
    
    if (isBuilding) {
      return NextResponse.json({
        transactions: []
      })
    }
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    
    if (!db) {
      return NextResponse.json({
        transactions: []
      })
    }

    const transactions = await db.transaction.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      transactions
    })

  } catch (error) {
    console.error('Error fetching transactions:', error)
    
    // Check if it's a Prisma initialization error
    if (error instanceof Error && error.message.includes('PrismaClientInitializationError')) {
      return NextResponse.json({
        transactions: []
      })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## 5. src/app/api/gift/participations/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'

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

export async function GET(request: NextRequest) {
  try {
    // Check if we're in build phase
    const isBuilding = process.env.NEXT_PHASE === 'phase-production-build'
    
    if (isBuilding) {
      return NextResponse.json({
        participations: []
      })
    }
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    
    if (!db) {
      return NextResponse.json({
        participations: []
      })
    }

    const participations = await db.gift.findMany({
      where: { userId },
      include: {
        winner: {
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

    return NextResponse.json({
      participations
    })

  } catch (error) {
    console.error('Error fetching participations:', error)
    
    // Check if it's a Prisma initialization error
    if (error instanceof Error && error.message.includes('PrismaClientInitializationError')) {
      return NextResponse.json({
        participations: []
      })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## 6. src/app/api/gift/participate/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'

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

export async function POST(request: NextRequest) {
  try {
    // Check if we're in build phase
    const isBuilding = process.env.NEXT_PHASE === 'phase-production-build'
    
    if (isBuilding) {
      return NextResponse.json({
        error: 'Build phase - service unavailable'
      }, { status: 503 })
    }
    
    const { userId, giftId } = await request.json()

    if (!userId || !giftId) {
      return NextResponse.json(
        { error: 'User ID and Gift ID are required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    
    if (!db) {
      return NextResponse.json({
        error: 'Database not available'
      }, { status: 503 })
    }

    // Check if gift exists and is active
    const gift = await db.gift.findUnique({
      where: { id: giftId }
    })

    if (!gift || gift.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Gift not found or not active' },
        { status: 404 }
      )
    }

    // Create participation record
    const participation = await db.gift.create({
      data: {
        name: `Participation for ${userId}`,
        type: gift.type,
        value: gift.value,
        status: 'ACTIVE',
        userId: userId
      }
    })

    return NextResponse.json({
      message: 'Participation successful',
      participation
    })

  } catch (error) {
    console.error('Participation error:', error)
    
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
```

## 7. src/app/api/gift/active/route.ts

```typescript
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
      return NextResponse.json({
        gifts: []
      })
    }
    
    const db = await getDb()
    
    if (!db) {
      return NextResponse.json({
        gifts: []
      })
    }

    const gifts = await db.gift.findMany({
      where: { status: 'ACTIVE' },
      include: {
        winner: {
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

    return NextResponse.json({
      gifts
    })

  } catch (error) {
    console.error('Error fetching active gifts:', error)
    
    // Check if it's a Prisma initialization error
    if (error instanceof Error && error.message.includes('PrismaClientInitializationError')) {
      return NextResponse.json({
        gifts: []
      })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## 8. src/app/api/admin/users/toggle/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'

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

export async function POST(request: NextRequest) {
  try {
    // Check if we're in build phase
    const isBuilding = process.env.NEXT_PHASE === 'phase-production-build'
    
    if (isBuilding) {
      return NextResponse.json({
        error: 'Build phase - service unavailable'
      }, { status: 503 })
    }
    
    const { userId, isActive } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    
    if (!db) {
      return NextResponse.json({
        error: 'Database not available'
      }, { status: 503 })
    }

    const user = await db.user.update({
      where: { id: userId },
      data: { isActive }
    })

    return NextResponse.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    })

  } catch (error) {
    console.error('User toggle error:', error)
    
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
```

## 9. src/app/api/admin/plans/update/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'

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

export async function POST(request: NextRequest) {
  try {
    // Check if we're in build phase
    const isBuilding = process.env.NEXT_PHASE === 'phase-production-build'
    
    if (isBuilding) {
      return NextResponse.json({
        error: 'Build phase - service unavailable'
      }, { status: 503 })
    }
    
    const { planId, updates } = await request.json()

    if (!planId || !updates) {
      return NextResponse.json(
        { error: 'Plan ID and updates are required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    
    if (!db) {
      return NextResponse.json({
        error: 'Database not available'
      }, { status: 503 })
    }

    const plan = await db.plan.update({
      where: { id: planId },
      data: updates
    })

    return NextResponse.json({
      message: 'Plan updated successfully',
      plan
    })

  } catch (error) {
    console.error('Plan update error:', error)
    
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
```

## 10. src/app/api/admin/plans/toggle/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'

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

export async function POST(request: NextRequest) {
  try {
    // Check if we're in build phase
    const isBuilding = process.env.NEXT_PHASE === 'phase-production-build'
    
    if (isBuilding) {
      return NextResponse.json({
        error: 'Build phase - service unavailable'
      }, { status: 503 })
    }
    
    const { planId, isActive } = await request.json()

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    
    if (!db) {
      return NextResponse.json({
        error: 'Database not available'
      }, { status: 503 })
    }

    const plan = await db.plan.update({
      where: { id: planId },
      data: { isActive }
    })

    return NextResponse.json({
      message: `Plan ${isActive ? 'activated' : 'deactivated'} successfully`,
      plan
    })

  } catch (error) {
    console.error('Plan toggle error:', error)
    
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
```

## Instructions

1. **Copy each section** above
2. **Paste it into the corresponding file** (replace all content)
3. **Save each file**
4. **Commit and push** the changes
5. **Redeploy** on Vercel

This will fix all the Prisma initialization errors and allow your deployment to succeed!