import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createAdminUser(email: string, password: string) {
  const hashedPassword = await hashPassword(password)
  return prisma.customer.upsert({
    where: { email },
    update: { hashedPassword },
    create: {
      email,
      hashedPassword,
      name: 'Admin',
    },
  })
}

export async function verifyAdmin(email: string, password: string) {
  const customer = await prisma.customer.findUnique({
    where: { email },
  })

  if (!customer || !customer.hashedPassword) {
    return null
  }

  const isValid = await verifyPassword(password, customer.hashedPassword)
  if (!isValid) {
    return null
  }

  return customer
}
