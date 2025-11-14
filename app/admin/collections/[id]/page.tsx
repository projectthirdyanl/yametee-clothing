import { notFound } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import CollectionForm from '@/components/CollectionForm'
import { prisma } from '@/lib/prisma'

async function getFormData(id: string) {
  try {
    const [collection, products] = await Promise.all([
      prisma.collection.findUnique({
        where: { id },
        include: {
          products: {
            include: {
              product: {
                select: { id: true, name: true, slug: true, status: true },
              },
            },
            orderBy: { displayOrder: 'asc' },
          },
          releaseWindows: {
            orderBy: { startsAt: 'asc' },
          },
        },
      }),
      prisma.product.findMany({
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
        },
      }),
    ])

    return { collection, products }
  } catch (error) {
    console.error('Error fetching collection form data:', error)
    return { collection: null, products: [] }
  }
}

const serializeCollection = (collection: NonNullable<Awaited<ReturnType<typeof getFormData>>['collection']>) => ({
  id: collection.id,
  title: collection.title,
  slug: collection.slug,
  subtitle: collection.subtitle,
  description: collection.description,
  status: collection.status,
  heroImage: collection.heroImage,
  lookbookImages: collection.lookbookImages || [],
  launchDate: collection.launchDate ? collection.launchDate.toISOString() : null,
  story: collection.story as any,
  products: collection.products.map((entry) => ({
    productId: entry.productId,
    displayOrder: entry.displayOrder,
    featured: entry.featured,
    product: entry.product,
  })),
  releaseWindows: collection.releaseWindows.map((window) => ({
    id: window.id,
    startsAt: window.startsAt.toISOString(),
    endsAt: window.endsAt ? window.endsAt.toISOString() : '',
    status: window.status,
    allowlistOnly: window.allowlistOnly,
    password: window.password || '',
    notes: window.notes || '',
    maxUnits: window.maxUnits?.toString() || '',
  })),
})

export default async function EditCollectionPage({ params }: { params: { id: string } }) {
  const { collection, products } = await getFormData(params.id)

  if (!collection) {
    notFound()
  }

  const serialized = serializeCollection(collection)

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Edit Collection</h1>
      <CollectionForm products={products} collection={serialized} />
    </AdminLayout>
  )
}
