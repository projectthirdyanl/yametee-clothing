import { notFound } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import PromotionForm from '@/components/PromotionForm'
import { prisma } from '@/lib/prisma'

async function getFormData(id: string) {
  try {
    const [promotion, collections] = await Promise.all([
      prisma.promotion.findUnique({
        where: { id },
        include: {
          rules: true,
        },
      }),
      prisma.collection.findMany({
        orderBy: { title: 'asc' },
        select: {
          id: true,
          title: true,
          slug: true,
        },
      }),
    ])

    return { promotion, collections }
  } catch (error) {
    console.error('Error loading promotion form data:', error)
    return { promotion: null, collections: [] }
  }
}

const serializePromotion = (promotion: NonNullable<Awaited<ReturnType<typeof getFormData>>['promotion']>) => {
  const minSubtotalRule = promotion.rules.find((rule) => rule.ruleType === 'MIN_SUBTOTAL')
  const customerTierRule = promotion.rules.find((rule) => rule.ruleType === 'CUSTOMER_TIER')
  const firstPurchaseRule = promotion.rules.find((rule) => rule.ruleType === 'FIRST_PURCHASE')

  return {
    id: promotion.id,
    name: promotion.name,
    code: promotion.code,
    description: promotion.description,
    type: promotion.type,
    status: promotion.status,
    value: promotion.value.toString(),
    stackable: promotion.stackable,
    usageLimit: promotion.usageLimit,
    startsAt: promotion.startsAt ? promotion.startsAt.toISOString() : null,
    endsAt: promotion.endsAt ? promotion.endsAt.toISOString() : null,
    channels: promotion.channels,
    collectionId: promotion.collectionId,
    minSubtotal: minSubtotalRule?.payload
      ? String((minSubtotalRule.payload as any).minSubtotal ?? (minSubtotalRule.payload as any).threshold ?? '')
      : '',
    customerTier: customerTierRule?.payload ? (customerTierRule.payload as any).tier || '' : '',
    firstPurchaseOnly: Boolean(firstPurchaseRule?.payload && (firstPurchaseRule.payload as any).firstPurchaseOnly),
  }
}

export default async function EditPromotionPage({ params }: { params: { id: string } }) {
  const { promotion, collections } = await getFormData(params.id)

  if (!promotion) {
    notFound()
  }

  const serialized = serializePromotion(promotion)

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Edit Promotion</h1>
      <PromotionForm collections={collections} promotion={serialized} />
    </AdminLayout>
  )
}
