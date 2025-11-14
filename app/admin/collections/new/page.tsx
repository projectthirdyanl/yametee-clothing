import AdminLayout from '@/components/AdminLayout'
import CollectionForm from '@/components/CollectionForm'
import { prisma } from '@/lib/prisma'

async function getFormData() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
      },
    })
    return { products }
  } catch (error) {
    console.error('Error fetching products for collection form:', error)
    return { products: [] }
  }
}

export default async function NewCollectionPage() {
  const { products } = await getFormData()

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Create Collection</h1>
      <CollectionForm products={products} />
    </AdminLayout>
  )
}
