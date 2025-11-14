import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        variants: {
          orderBy: { price: 'asc' },
          take: 1,
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

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-12 text-gray-900 dark:text-white">All Products</h1>
          
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 dark:text-gray-400 text-xl">No products available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const variant = product.variants[0]
                const image = product.images[0]
                
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group bg-white dark:bg-yametee-gray border border-gray-200 dark:border-yametee-lightGray/30 rounded-xl overflow-hidden hover:border-yametee-red/50 transition-all hover:scale-105 shadow-lg hover:shadow-yametee-red/20"
                  >
                    {image ? (
                      <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-yametee-gray dark:to-yametee-dark">
                        <img
                          src={image.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-yametee-gray dark:to-yametee-dark flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                    <div className="p-4 bg-white dark:bg-yametee-gray">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-yametee-red transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      {variant && (
                        <div className="flex items-baseline gap-2">
                          <p className="text-yametee-red text-xl font-bold">
                            {formatPrice(variant.price)}
                          </p>
                          <p className="text-gray-400 text-sm line-through">₱799</p>
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
