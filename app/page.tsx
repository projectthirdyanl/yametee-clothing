import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'
import EmailSignup from '@/components/EmailSignup'

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { status: 'ACTIVE', isFeatured: true },
      include: {
        images: {
          orderBy: [{ isPrimary: 'desc' }, { position: 'asc' }],
          take: 2,
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
    <div className="min-h-screen flex flex-col bg-yametee-bg">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 px-4 bg-yametee-bg">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Left Column - Brand Description */}
              <div className="space-y-6">
                <p className="text-xs md:text-sm text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  YAMETEE MANILA
                </p>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-gray-900 dark:text-white">STREETWEAR FOR </span>
                  <span className="text-yametee-red">T-SHIRT</span>
                  <span className="text-gray-900 dark:text-white"> PURISTS.</span>
                </h1>
                
                <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-xl">
                  Built like your favorite skate decks, rugged, oversized, pre-shrunk. Designed for Manila humidity with breathable 240GSM cotton and prints that never crack. This is your daily uniform.
                </p>
                
                {/* Feature Tags */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <span className="px-4 py-2 bg-yametee-gray dark:bg-yametee-lightGray text-gray-700 dark:text-gray-300 text-xs md:text-sm font-medium rounded-full border border-yametee-lightGray/30">
                    HEAVYWEIGHT 240GSM
                  </span>
                  <span className="px-4 py-2 bg-yametee-gray dark:bg-yametee-lightGray text-gray-700 dark:text-gray-300 text-xs md:text-sm font-medium rounded-full border border-yametee-lightGray/30">
                    PRE-SHRUNK
                  </span>
                  <span className="px-4 py-2 bg-yametee-gray dark:bg-yametee-lightGray text-gray-700 dark:text-gray-300 text-xs md:text-sm font-medium rounded-full border border-yametee-lightGray/30">
                    SILKSCREENED
                  </span>
                  <span className="px-4 py-2 bg-yametee-gray dark:bg-yametee-lightGray text-gray-700 dark:text-gray-300 text-xs md:text-sm font-medium rounded-full border border-yametee-lightGray/30">
                    LIMITED DROPS
                  </span>
                </div>
              </div>

              {/* Right Column - Email Signup */}
              <div className="lg:sticky lg:top-24">
                <EmailSignup />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {products.length > 0 && (
          <section className="py-16 px-4 bg-yametee-bg">
            <div className="container mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white">
                Featured Drops
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => {
                  const variant = product.variants[0]
                  const primaryImage = product.images[0]
                  const secondaryImage = product.images[1]
                  
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="group bg-yametee-gray dark:bg-yametee-lightGray border border-yametee-lightGray/30 rounded-xl overflow-hidden hover:border-yametee-red/50 transition-all hover:scale-105 shadow-lg hover:shadow-yametee-red/20"
                    >
                      {primaryImage && (
                        <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-yametee-gray dark:to-yametee-dark">
                          <img
                            src={primaryImage.imageUrl}
                            alt={`${product.name} front`}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${secondaryImage ? 'opacity-100 group-hover:opacity-0' : 'opacity-100'} group-hover:scale-105`}
                          />
                          {secondaryImage && (
                            <img
                              src={secondaryImage.imageUrl}
                              alt={`${product.name} back`}
                              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
                            />
                          )}
                        </div>
                      )}
                      <div className="p-4 bg-yametee-gray dark:bg-yametee-lightGray">
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
