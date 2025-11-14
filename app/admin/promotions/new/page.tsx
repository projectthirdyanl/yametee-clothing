import AdminLayout from '@/components/AdminLayout'
import PromotionForm from '@/components/PromotionForm'
import { prisma } from '@/lib/prisma'

async function getCollections() {
  try {
    return await prisma.collection.findMany({
      orderBy: { title: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    })
  } catch (error) {
    console.error('Error fetching collections for promotions:', error)
    return []
  }
}

export default async function NewPromotionPage() {
  const collections = await getCollections()

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Create Promotion</h1>
      <PromotionForm collections={collections} />
    </AdminLayout>
  )
}
