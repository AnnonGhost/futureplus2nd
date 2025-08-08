import { PrismaClient } from '@prisma/client'

// Global singleton to prevent multiple instances
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a build-safe Prisma client
const createPrismaClient = () => {
  // Check if we're in build phase
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'
  const isVercel = process.env.VERCEL === '1' || process.env.NOW_REGION !== undefined
  
  if (isBuildPhase) {
    // During build phase, return a mock client that throws helpful errors
    console.log('🔧 Build phase detected - using mock Prisma client')
    return new Proxy({} as PrismaClient, {
      get: (target, prop) => {
        if (prop === '$connect' || prop === '$disconnect') {
          return () => Promise.resolve()
        }
        return () => {
          throw new Error(`Database access not available during build phase. Property: ${String(prop)}`)
        }
      }
    })
  }

  if (isVercel) {
    // Vercel-specific configuration
    console.log('🚀 Initializing Prisma client for Vercel environment')
    
    try {
      const client = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
      })
      
      // Test the connection asynchronously
      client.$connect()
        .then(() => {
          console.log('✅ Prisma client connected successfully')
        })
        .catch((error) => {
          console.error('❌ Prisma client connection failed:', error)
        })
      
      return client
    } catch (error) {
      console.error('❌ Failed to create Prisma client for Vercel:', error)
      // Fallback client with minimal logging
      return new PrismaClient({
        log: ['error'],
      })
    }
  } else {
    // Local development
    console.log('🛠️ Initializing Prisma client for local development')
    return new PrismaClient({
      log: ['query'],
    })
  }
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}