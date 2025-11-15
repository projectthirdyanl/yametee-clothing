import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'
import { createPayMongoCheckout, PaymentMethod } from '@/lib/paymongo'
import { getCartSessionId, getOrCreateCart } from '@/lib/cart'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cart, customer, paymentMethod } = body

    // Validate payment method
    const validPaymentMethods: PaymentMethod[] = ['gcash', 'paymaya', 'card', 'bank_transfer']
    if (!paymentMethod || !validPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Please select a valid payment method' },
        { status: 400 }
      )
    }

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Validate stock availability
    for (const item of cart) {
      const variant = await prisma.variant.findUnique({
        where: { id: item.variantId },
      })

      if (!variant) {
        return NextResponse.json(
          { error: `Variant not found: ${item.variantId}` },
          { status: 400 }
        )
      }

      if (variant.stockQuantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.productName}` },
          { status: 400 }
        )
      }
    }

    // Calculate totals
    const subtotal = cart.reduce(
      (sum: number, item: any) => sum + parseFloat(item.price.toString()) * item.quantity,
      0
    )
    const shippingFee = 100
    const grandTotal = subtotal + shippingFee

    // Create or find customer
    let customerRecord = null
    if (customer.email) {
      customerRecord = await prisma.customer.upsert({
        where: { email: customer.email },
        update: {
          name: customer.name,
          phone: customer.phone,
        },
        create: {
          email: customer.email,
          name: customer.name,
          phone: customer.phone,
        },
      })
    }

    // Create address
    const address = await prisma.address.create({
      data: {
        customerId: customerRecord?.id,
        fullName: customer.name,
        phone: customer.phone,
        line1: customer.line1,
        line2: customer.line2 || null,
        city: customer.city,
        province: customer.province,
        postalCode: customer.postalCode,
        country: 'Philippines',
      },
    })

    // Create order
    const orderNumber = generateOrderNumber()
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customerRecord?.id || null,
        addressId: address.id,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        paymentProvider: 'PAYMONGO',
        subtotal,
        shippingFee,
        discountTotal: 0,
        grandTotal,
        items: {
          create: cart.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: parseFloat(item.price.toString()) * item.quantity,
          })),
        },
      },
    })

    // Create PayMongo checkout session with selected payment method
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const checkoutSession = await createPayMongoCheckout({
      amount: Math.round(grandTotal * 100), // Convert to centavos
      description: `Yametee Order ${orderNumber}`,
      success_url: `${baseUrl}/order/${orderNumber}?status=success`,
      failed_url: `${baseUrl}/checkout?status=failed`,
      paymentMethod: paymentMethod as PaymentMethod,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentMethod,
      },
    })

    // Create payment record with payment method
    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: 'PAYMONGO',
        providerPaymentId: checkoutSession.data.id,
        amount: grandTotal,
        status: 'PENDING',
        rawPayload: {
          paymentMethod,
        } as any,
      },
    })

    // Clear the cart after successful order creation
    try {
      const sessionId = await getCartSessionId()
      const cart = await getOrCreateCart(sessionId)
      
      // Delete all cart items
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      })
    } catch (error) {
      // Log error but don't fail checkout if cart clearing fails
      console.error('Failed to clear cart after checkout:', error)
    }

    return NextResponse.json({
      orderNumber,
      checkoutUrl: checkoutSession.data.attributes.checkout_url,
    })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Checkout failed' },
      { status: 500 }
    )
  }
}
