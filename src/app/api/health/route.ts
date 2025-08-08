import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if we're in build phase
    const isBuilding = process.env.NEXT_PHASE === 'phase-production-build'
    
    if (isBuilding) {
      return NextResponse.json({ 
        status: "BUILD_MODE",
        message: "System is building - limited functionality",
        timestamp: new Date().toISOString()
      });
    }

    // Check database connectivity
    let dbAvailable = false
    try {
      const { db } = await import('@/lib/db')
      await db.$queryRaw`SELECT 1`
      dbAvailable = true
    } catch (error) {
      console.error('Database not available:', error)
    }

    return NextResponse.json({ 
      status: "OK",
      message: "Future Plus API is running",
      database: dbAvailable ? "CONNECTED" : "DISCONNECTED",
      environment: process.env.NODE_ENV || "unknown",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      status: "ERROR",
      message: "Health check failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}