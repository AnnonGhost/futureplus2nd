import { PrismaClient } from '@prisma/client'

// Special handling for Vercel deployment
const createPrismaClient = () => {
  // Check if we're in Vercel environment
  const isVercel = process.env.VERCEL === '1' || process.env.NOW_REGION !== undefined
  
  if (isVercel) {
    // Vercel-specific configuration
    console.log('🚀 Initializing Prisma client for Vercel environment')
    
    try {
      const client = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
      })
      
      // Test the connection
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

// Global singleton to prevent multiple instances
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}