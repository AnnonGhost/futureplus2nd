// Safe database client that handles Vercel build-time issues
let db: any = null

// Only initialize Prisma client when not in build phase or when explicitly needed
export const getDb = () => {
  if (db) return db
  
  // Check if we're in a build phase
  const isBuilding = process.env.NEXT_PHASE === 'phase-production-build' || 
                   process.env.VERCEL_ENV === 'production' && 
                   process.env.NEXT_PHASE !== undefined
  
  if (isBuilding) {
    // Return a mock client during build to avoid Prisma initialization errors
    return {
      $connect: async () => {},
      $disconnect: async () => {},
      $executeRaw: async () => { return [] },
      $queryRaw: async () => { return [] },
      user: {
        findMany: async () => [],
        findUnique: async () => null,
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({}),
      },
      wallet: {
        findMany: async () => [],
        findUnique: async () => null,
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({}),
      },
      transaction: {
        findMany: async () => [],
        findUnique: async () => null,
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({}),
      },
      referral: {
        findMany: async () => [],
        findUnique: async () => null,
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({}),
      },
      plan: {
        findMany: async () => [],
        findUnique: async () => null,
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({}),
      },
      userPlan: {
        findMany: async () => [],
        findUnique: async () => null,
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({}),
      },
      gift: {
        findMany: async () => [],
        findUnique: async () => null,
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({}),
      },
      admin: {
        findMany: async () => [],
        findUnique: async () => null,
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({}),
      },
    }
  }
  
  try {
    // Import Prisma dynamically to avoid build-time issues
    const { PrismaClient } = require('@prisma/client')
    db = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    })
    return db
  } catch (error) {
    console.error('Failed to initialize Prisma client:', error)
    // Return mock client as fallback
    return getDb()
  }
}

export const db = getDb()