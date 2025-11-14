import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const buildRulePayloads = ({
  minSubtotal,
  customerTier,
  firstPurchaseOnly,
}: {
  minSubtotal?: number | null
  customerTier?: string | null
  firstPurchaseOnly?: boolean
}) => {
  const rules = []
  if (typeof minSubtotal === 'number' && !Number.isNaN(minSubtotal)) {
    rules.push({
      ruleType: 'MIN_SUBTOTAL' as const,
      payload: { minSubtotal },
    })
  }
  if (customerTier) {
    rules.push({
      ruleType: 'CUSTOMER_TIER' as const,
      payload: { tier: customerTier },
    })
  }
  if (firstPurchaseOnly) {
    rules.push({
      ruleType: 'FIRST_PURCHASE' as const,
      payload: { firstPurchaseOnly: true },
    })
  }
  return rules
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      code,
      description,
      type,
      status,
      value,
      stackable = false,
      usageLimit,
      startsAt,
      endsAt,
      channels = [],
      collectionId,
      minSubtotal,
      customerTier,
      firstPurchaseOnly,
    } = body

    if (!name || !type || !status || value === undefined || value === null) {
      return NextResponse.json({ error: 'Name, type, status, and value are required' }, { status: 400 })
    }

    const promotion = await prisma.promotion.create({
      data: {
        name,
        code: code || null,
        description: description || null,
        type,
        status,
        value: parseFloat(value),
        stackable: Boolean(stackable),
        usageLimit: usageLimit ? Number(usageLimit) : null,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: endsAt ? new Date(endsAt) : null,
        channels: Array.isArray(channels) ? channels : [],
        collectionId: collectionId || null,
        rules: {
          create: buildRulePayloads({
            minSubtotal: typeof minSubtotal === 'number' ? minSubtotal : minSubtotal ? Number(minSubtotal) : null,
            customerTier: customerTier || null,
            firstPurchaseOnly: Boolean(firstPurchaseOnly),
          }),
        },
      },
    })

    return NextResponse.json({ promotion }, { status: 201 })
  } catch (error: any) {
    console.error('Create promotion error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create promotion' },
      { status: 500 },
    )
  }
}
