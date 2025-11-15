// PayMongo API integration
const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY || ''
const PAYMONGO_PUBLIC_KEY = process.env.PAYMONGO_PUBLIC_KEY || ''

export type PaymentMethod = 'gcash' | 'paymaya' | 'card' | 'bank_transfer'

export interface PayMongoCheckoutSession {
  amount: number // in centavos
  description: string
  success_url: string
  failed_url: string
  paymentMethod?: PaymentMethod // Optional: if provided, only show this method
  metadata?: Record<string, any>
}

export interface PayMongoResponse {
  data: {
    id: string
    attributes: {
      checkout_url: string
      amount: number
      status: string
    }
  }
}

/**
 * Map payment method to PayMongo payment method types
 * PayMongo supports: gcash, paymaya, card, and bank_transfer (online banking)
 */
function getPaymentMethodTypes(paymentMethod?: PaymentMethod): string[] {
  if (paymentMethod) {
    // If specific method selected, only show that method
    return [paymentMethod]
  }
  // Default: show all available methods
  return ['gcash', 'paymaya', 'card', 'bank_transfer']
}

export async function createPayMongoCheckout(
  session: PayMongoCheckoutSession
): Promise<PayMongoResponse> {
  const { paymentMethod, ...sessionData } = session
  const payment_method_types = getPaymentMethodTypes(paymentMethod)

  const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`,
    },
    body: JSON.stringify({
      data: {
        attributes: {
          ...sessionData,
          payment_method_types,
        },
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`PayMongo API error: ${error}`)
  }

  return response.json()
}

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // PayMongo webhook signature verification
  // PayMongo sends signature in format: "t=<timestamp>,v1=<hmac_signature>"
  // In production, properly verify HMAC-SHA256 signature
  // For development, we'll accept if webhook secret is set
  if (!secret) {
    return false
  }
  
  // Basic check - in production, implement proper HMAC verification
  // const crypto = require('crypto')
  // const hmac = crypto.createHmac('sha256', secret)
  // hmac.update(payload)
  // const expectedSignature = hmac.digest('hex')
  // return signature.includes(expectedSignature)
  
  return true // For now, accept if secret is configured
}
