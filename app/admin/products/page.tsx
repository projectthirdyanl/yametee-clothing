import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import AdminLayout from '@/components/AdminLayout'
import DeleteProductButton from '@/components/DeleteProductButton'

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        variants: {
          select: {
            stockQuantity: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-yametee-red text-white px-6 py-2 rounded-lg font-semibold hover:bg-yametee-red/90 transition-all"
        >
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 dark:text-gray-400 text-xl mb-6">No products yet.</p>
          <Link
            href="/admin/products/new"
            className="inline-block bg-yametee-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-yametee-red/90 transition-all"
          >
            Create Your First Product
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-yametee-gray border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-yametee-dark border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-900 dark:text-white font-semibold">Product</th>
                <th className="text-left p-4 text-gray-900 dark:text-white font-semibold">Status</th>
                <th className="text-left p-4 text-gray-900 dark:text-white font-semibold">Stock</th>
                <th className="text-left p-4 text-gray-900 dark:text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const totalStock = product.variants.reduce(
                  (sum, v) => sum + v.stockQuantity,
                  0
                )
                const image = product.images[0]

                return (
                  <tr
                    key={product.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-yametee-dark/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        {image && (
                          <img
                            src={image.imageUrl}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <p className="text-gray-900 dark:text-white font-semibold">{product.name}</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          product.status === 'ACTIVE'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : product.status === 'DRAFT'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-900 dark:text-white">{totalStock} units</td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-yametee-red hover:text-yametee-red/80 transition-colors"
                        >
                          Edit
                        </Link>
                        <DeleteProductButton productId={product.id} productName={product.name} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
