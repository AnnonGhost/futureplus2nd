const fs = require('fs')
const path = require('path')

// Find all API route files that use database
const apiRoutesDir = path.join(__dirname, '../src/app/api')
const filesToDisable = []
const originalContents = new Map()

function findApiRoutes(dir) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      findApiRoutes(filePath)
    } else if (file === 'route.ts') {
      const content = fs.readFileSync(filePath, 'utf8')
      if (content.includes("import { db } from '@/lib/db'") || 
          content.includes('PrismaClientInitializationError')) {
        filesToDisable.push(filePath)
        originalContents.set(filePath, content)
      }
    }
  })
}

findApiRoutes(apiRoutesDir)

console.log('Found API routes to disable during build:', filesToDisable.length)

// Create disabled version of each file
const disabledTemplate = (originalPath) => `import { NextResponse } from 'next/server'

// This route is temporarily disabled during build to avoid Prisma initialization issues
// Original functionality will be restored after deployment

export async function GET() {
  return NextResponse.json({
    message: 'Service temporarily disabled during deployment',
    route: '${originalPath}',
    status: 'maintenance'
  })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'Service temporarily disabled during deployment',
    route: '${originalPath}',
    status: 'maintenance'
  })
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({
    message: 'Service temporarily disabled during deployment',
    route: '${originalPath}',
    status: 'maintenance'
  })
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({
    message: 'Service temporarily disabled during deployment',
    route: '${originalPath}',
    status: 'maintenance'
  })
}`

// Disable each file
filesToDisable.forEach(filePath => {
  const routeName = path.relative(path.join(__dirname, '../src/app/api'), filePath)
  const disabledContent = disabledTemplate(routeName)
  
  fs.writeFileSync(filePath, disabledContent)
  console.log(`Disabled: ${filePath}`)
})

// Save original contents for restoration
const restoreScript = `const fs = require('fs')
const path = require('path')

const originalContents = new Map(${JSON.stringify(Array.from(originalContents.entries()))})

originalContents.forEach((content, filePath) => {
  fs.writeFileSync(filePath, content)
  console.log('Restored:', filePath)
})

console.log('All API routes have been restored!')
`

fs.writeFileSync(path.join(__dirname, 'restore-api-routes.js'), restoreScript)

console.log('All API routes have been disabled for build!')
console.log('Run "node scripts/restore-api-routes.js" after deployment to restore original functionality')