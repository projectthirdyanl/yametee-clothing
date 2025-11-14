import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'

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
    <div className="flex min-h-screen flex-col bg-white text-gray-900 transition-colors dark:bg-yametee-bg dark:text-white">
      <Header />

      <main className="flex-1 px-4 py-16">
        <div className="container mx-auto space-y-12">
          <div className="rounded-[32px] border border-gray-200 bg-white p-8 text-gray-900 shadow-sm dark:border-white/10 dark:bg-street-carbon/70 dark:text-white">
            <p className="text-xs uppercase tracking-[0.4em] text-gray-500 dark:text-white/60">
              Catalog 07 · Tees Only
            </p>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h1 className="font-display text-4xl tracking-[0.2em]">Every Yame-Tee is a statement piece.</h1>
              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-white/60">
                {['Oversized fit', '240GSM', 'Limited runs'].map((chip) => (
                  <span key={chip} className="stat-pill text-gray-600 dark:text-white/70">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-gray-600 dark:text-white/70">
              Scroll through the full Yame-Tee roster—art heavy tees inspired by anime, skate grime, and Manila neon. No
              filler, no basics. Just grails.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white py-20 text-center text-gray-500 shadow-sm dark:border-white/10 dark:bg-street-carbon/60 dark:text-white/60">
              <p className="text-xl uppercase tracking-[0.4em]">No tees yet. Drop incoming.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
