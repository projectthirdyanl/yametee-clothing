const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  const email = process.argv[2] || 'admin@yametee.com'
  const password = process.argv[3] || 'admin123'
  const name = process.argv[4] || 'Admin'

  try {
    console.log(`Creating admin user: ${email}`)
    
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const admin = await prisma.customer.upsert({
      where: { email },
      update: {
        hashedPassword,
        name,
      },
      create: {
        email,
        hashedPassword,
        name,
      },
    })

    console.log('✅ Admin user created successfully!')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    console.log(`   ID: ${admin.id}`)
    console.log('\n⚠️  Please change the password after first login!')
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
