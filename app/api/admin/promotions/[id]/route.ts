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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const existing = await prisma.promotion.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Promotion not found' }, { status: 404 })
    }

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

    const promotion = await prisma.promotion.update({
      where: { id },
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
          deleteMany: { promotionId: id },
          create: buildRulePayloads({
            minSubtotal: typeof minSubtotal === 'number' ? minSubtotal : minSubtotal ? Number(minSubtotal) : null,
            customerTier: customerTier || null,
            firstPurchaseOnly: Boolean(firstPurchaseOnly),
          }),
        },
      },
    })

    return NextResponse.json({ promotion })
  } catch (error: any) {
    console.error('Update promotion error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update promotion' },
      { status: 500 },
    )
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.promotion.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete promotion error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete promotion' },
      { status: 500 },
    )
  }
}
