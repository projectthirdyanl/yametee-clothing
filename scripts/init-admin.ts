import { createAdminUser } from '../lib/auth'

const email = process.argv[2] || process.env.ADMIN_EMAIL || 'admin@yametee.com'
const password = process.argv[3] || process.env.ADMIN_PASSWORD || 'changeme'

async function init() {
  try {
    await createAdminUser(email, password)
    console.log(`✅ Admin user created: ${email}`)
    console.log(`   Password: ${password}`)
    console.log(`   Please change the password after first login!`)
  } catch (error: any) {
    console.error('❌ Error creating admin user:', error.message)
    process.exit(1)
  }
}

init()
