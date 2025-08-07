import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@futureplus.in' },
    update: {},
    create: {
      email: 'admin@futureplus.in',
      password: adminPassword,
      key: 'FUTUREPLUS_ADMIN_KEY_2024',
      isActive: true,
    },
  })

  console.log('✅ Admin user created:', admin.email)

  // Create plans
  const plans = [
    {
      id: 'plan-lucky-draw',
      name: 'Lucky Draw',
      description: 'Entry into daily lucky draw with exciting prizes',
      price: 450,
      duration: 30,
      dailyReturn: 50,
      type: 'LUCKY_DRAW',
    },
    {
      id: 'plan-passion-income',
      name: 'Passion Income',
      description: 'Steady daily returns for passionate earners',
      price: 1700,
      duration: 60,
      dailyReturn: 200,
      type: 'PASSION_INCOME',
    },
    {
      id: 'plan-premium',
      name: 'Premium',
      description: 'Premium plan with higher daily returns',
      price: 3500,
      duration: 90,
      dailyReturn: 450,
      type: 'PREMIUM',
    },
    {
      id: 'plan-big-bonanza',
      name: 'Big Bonanza',
      description: 'Maximum returns for serious investors',
      price: 8500,
      duration: 120,
      dailyReturn: 1200,
      type: 'BIG_BONANZA',
    },
  ]

  for (const plan of plans) {
    const createdPlan = await prisma.plan.upsert({
      where: { id: plan.id },
      update: {},
      create: plan,
    })
    console.log('✅ Plan created:', createdPlan.name)
  }

  // Create some sample gifts
  const gifts = [
    {
      id: 'gift-daily-lucky',
      name: 'Daily Lucky Draw',
      type: 'LUCKY_DRAW',
      value: 1000,
      status: 'ACTIVE',
    },
    {
      id: 'gift-weekly-bonus',
      name: 'Weekly Bonus',
      type: 'BONUS',
      value: 5000,
      status: 'ACTIVE',
    },
    {
      id: 'gift-monthly-cashback',
      name: 'Monthly Cashback',
      type: 'CASHBACK',
      value: 10000,
      status: 'ACTIVE',
    },
  ]

  for (const gift of gifts) {
    // Create a dummy user for gift creator
    const dummyUser = await prisma.user.upsert({
      where: { email: 'system@futureplus.in' },
      update: {},
      create: {
        email: 'system@futureplus.in',
        mobile: '7015187070',
        password: await bcrypt.hash('system123', 12),
        name: 'System Account',
        isActive: true,
        wallet: {
          create: {
            balance: 0,
            bonus: 0,
          },
        },
      },
    })

    const createdGift = await prisma.gift.upsert({
      where: { id: gift.id },
      update: {},
      create: {
        ...gift,
        userId: dummyUser.id,
      },
    })
    console.log('✅ Gift created:', createdGift.name)
  }

  // Create sample users for testing
  const sampleUsers = [
    {
      email: 'demo@futureplus.in',
      mobile: '7015187071',
      name: 'Demo User',
      password: 'demo123',
    },
    {
      email: 'test@futureplus.in',
      mobile: '7015187072',
      name: 'Test User',
      password: 'test123',
    },
  ]

  for (const userData of sampleUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 12)
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        mobile: userData.mobile,
        name: userData.name,
        password: hashedPassword,
        isActive: true,
        wallet: {
          create: {
            balance: Math.floor(Math.random() * 10000) + 1000,
            bonus: Math.floor(Math.random() * 5000) + 500,
          },
        },
      },
    })
    console.log('✅ Sample user created:', user.email)
  }

  console.log('🎉 Database seeded successfully!')
  console.log('🔑 Admin credentials:')
  console.log('   Email: admin@futureplus.in')
  console.log('   Password: admin123')
  console.log('   Admin Key: FUTUREPLUS_ADMIN_KEY_2024')
  console.log('👥 Demo user credentials:')
  console.log('   Email: demo@futureplus.in')
  console.log('   Password: demo123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })