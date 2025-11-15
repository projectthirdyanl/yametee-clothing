import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { randomBytes } from 'crypto'

const CART_SESSION_COOKIE = 'cart_session_id'
const SESSION_EXPIRY_DAYS = 30

/**
 * Generate a unique session ID for guest carts
 */
export function generateSessionId(): string {
  return randomBytes(32).toString('hex')
}

/**
 * Get or create a cart session ID from cookies
 * This ensures each visitor has their own isolated cart
 */
export async function getCartSessionId(): Promise<string> {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get(CART_SESSION_COOKIE)?.value

  if (!sessionId) {
    sessionId = generateSessionId()
    cookieStore.set(CART_SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * SESSION_EXPIRY_DAYS, // 30 days
      path: '/',
    })
  }

  return sessionId
}

/**
 * Get or create a cart for a session or customer
 */
export async function getOrCreateCart(sessionId?: string, customerId?: string) {
  if (customerId) {
    // For logged-in users, find or create cart by customerId
    let cart = await prisma.cart.findFirst({
      where: { customerId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: [{ isPrimary: 'desc' }, { position: 'asc' }],
                  take: 1,
                },
              },
            },
            variant: true,
          },
        },
      },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { customerId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    orderBy: [{ isPrimary: 'desc' }, { position: 'asc' }],
                    take: 1,
                  },
                },
              },
              variant: true,
            },
          },
        },
      })
    }

    return cart
  }

  if (!sessionId) {
    throw new Error('Session ID or customer ID required')
  }

  // For guests, find or create cart by sessionId
  let cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                orderBy: [{ isPrimary: 'desc' }, { position: 'asc' }],
                take: 1,
              },
            },
          },
          variant: true,
        },
      },
    },
  })

  if (!cart) {
    cart = await prisma.cart.create({
      data: { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: [{ isPrimary: 'desc' }, { position: 'asc' }],
                  take: 1,
                },
              },
            },
            variant: true,
          },
        },
      },
    })
  }

  return cart
}

/**
 * Merge a guest cart into a customer cart when user logs in
 */
export async function mergeGuestCartToCustomer(sessionId: string, customerId: string) {
  const guestCart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: true },
  })

  if (!guestCart || guestCart.items.length === 0) {
    return
  }

  const customerCart = await getOrCreateCart(undefined, customerId)

  // Merge items from guest cart to customer cart
  for (const guestItem of guestCart.items) {
    const existingItem = customerCart.items.find(
      (item) => item.variantId === guestItem.variantId
    )

    if (existingItem) {
      // Update quantity if item already exists
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + guestItem.quantity },
      })
    } else {
      // Create new item
      await prisma.cartItem.create({
        data: {
          cartId: customerCart.id,
          productId: guestItem.productId,
          variantId: guestItem.variantId,
          quantity: guestItem.quantity,
        },
      })
    }
  }

  // Delete guest cart after merging
  await prisma.cart.delete({
    where: { id: guestCart.id },
  })
}
