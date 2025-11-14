import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminLayout from '@/components/AdminLayout'
import ProductForm from '@/components/ProductForm'

async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: [{ isPrimary: 'desc' }, { position: 'asc' }],
        },
        variants: true,
      },
    })
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Edit Product</h1>
      <ProductForm product={product} />
    </AdminLayout>
  )
}
