#!/bin/bash

# Vercel Build Script for Future Plus

echo "🚀 Starting Vercel build process..."

# Check if we're in production environment
if [ "$NODE_ENV" = "production" ]; then
    echo "📦 Production environment detected"
    
    # Use PostgreSQL schema for production
    cp prisma/vercel-schema.prisma prisma/schema.prisma
    
    # Generate Prisma client
    echo "🔧 Generating Prisma client..."
    npx prisma generate
    
    # Push database schema (if needed)
    echo "🗄️  Pushing database schema..."
    npx prisma db push --skip-generate
    
    # Run seed script (if database is empty)
    echo "🌱 Seeding database..."
    npx tsx prisma/seed.ts
    
else
    echo "🛠️  Development environment detected"
    
    # Use SQLite schema for development
    cp prisma/dev-schema.prisma prisma/schema.prisma
    
    # Generate Prisma client
    echo "🔧 Generating Prisma client..."
    npx prisma generate
fi

# Build Next.js application
echo "🏗️  Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"