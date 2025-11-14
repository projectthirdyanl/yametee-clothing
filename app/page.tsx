import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        variants: {
          take: 1,
        },
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
    })
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function Home() {
  const products = await getFeaturedProducts()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center bg-gradient-to-b from-yametee-bg to-yametee-dark transition-colors duration-300">
          <div className="container mx-auto">
            <div className="flex justify-center mb-6 animate-fade-in">
              <Image 
                src="/images/logos/logo-main.png" 
                alt="YAMETEE" 
                width={300}
                height={120}
                className="h-24 md:h-32 lg:h-40 w-auto invert dark:invert-0 transition-all duration-300"
                priority
              />
            </div>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4 animate-fade-in">
              Anime-Inspired Japanese Streetwear
            </p>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto animate-fade-in">
              <strong className="text-gray-900 dark:text-white">Yametee is a Filipino anime streetwear brand</strong> inspired by Japanese pop culture and the phrase <em>&quot;yamete kudasai&quot;</em>. We design bold, high-quality anime graphic tees made for everyday wear.
            </p>
            <Link
              href="/products"
              className="inline-block bg-yametee-red text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yametee-red/90 transition-all hover:scale-105 hover:shadow-lg hover:shadow-yametee-red/50"
            >
              Shop Now
            </Link>
          </div>
        </section>

        {/* Featured Products */}
        {products.length > 0 && (
          <section className="py-16 px-4">
            <div className="container mx-auto">
              <h2 className="text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white">
                Featured Drops
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => {
                  const variant = product.variants[0]
                  const image = product.images[0]
                  
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="group bg-white dark:bg-yametee-gray border border-gray-200 dark:border-yametee-lightGray/30 rounded-xl overflow-hidden hover:border-yametee-red/50 transition-all hover:scale-105 shadow-lg hover:shadow-yametee-red/20"
                    >
                      {image && (
                        <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-yametee-gray dark:to-yametee-dark">
                          <img
                            src={image.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4 bg-white dark:bg-yametee-gray">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-yametee-red transition-colors">
                          {product.name}
                        </h3>
                        {variant && (
                          <div className="flex items-baseline gap-2">
                            <p className="text-yametee-red text-lg font-bold">
                              ₱{parseFloat(variant.price.toString()).toFixed(2)}
                            </p>
                            <p className="text-gray-400 dark:text-gray-400 text-sm line-through">₱799</p>
                          </div>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
