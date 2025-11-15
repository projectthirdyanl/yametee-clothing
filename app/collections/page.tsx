import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'
import { formatReleaseLabel, getPrimaryReleaseWindow, humanizeReleaseStatus } from '@/lib/releases'

async function getCollections() {
  try {
    return await prisma.collection.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [
        { launchDate: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        products: {
          orderBy: { displayOrder: 'asc' },
          include: {
            product: {
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
            },
          },
        },
        releaseWindows: {
          orderBy: { startsAt: 'asc' },
        },
      },
    })
  } catch (error) {
    console.error('Error fetching collections', error)
    return []
  }
}

export default async function CollectionsPage() {
  const collections = await getCollections()

  return (
    <div className="min-h-screen flex flex-col bg-yametee-bg">
      <Header />
      <main className="flex-1">
        <section className="border-b border-yametee-lightGray/30 bg-gradient-to-b from-yametee-bg to-yametee-dark text-white py-16 px-4">
          <div className="container mx-auto text-center max-w-4xl space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-gray-400">Collections</p>
            <h1 className="text-4xl md:text-5xl font-extrabold">Chaptered Drops for the Culture</h1>
            <p className="text-lg text-gray-300">
              Dive into tightly curated capsules that celebrate anime arcs, Manila nightlife, and the relentless grind.
              Each drop ships with exclusive storytelling, bespoke packaging, and made-in-small-batch tees.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          {collections.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-yametee-lightGray/30">
              <p className="text-2xl font-semibold text-gray-200">No collections yet.</p>
              <p className="text-gray-400 mt-2">Spin up a drop inside the admin to see it live here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-10">
              {collections.map((collection) => {
                const productEntries = [...collection.products].sort((a, b) => a.displayOrder - b.displayOrder)
                const previewProduct = productEntries[0]?.product
                const heroImage =
                  collection.heroImage ||
                  collection.lookbookImages[0] ||
                  previewProduct?.images[0]?.imageUrl ||
                  '/images/logos/logo-main.png'
                const releaseLabel = formatReleaseLabel(collection.releaseWindows, {
                  fallbackDate: collection.launchDate,
                  style: 'long',
                })
                const primaryWindow = getPrimaryReleaseWindow(collection.releaseWindows)

                return (
                  <article
                    key={collection.id}
                    className="overflow-hidden rounded-3xl border border-yametee-lightGray/30 bg-gradient-to-br from-yametee-gray to-yametee-dark shadow-[0_25px_60px_rgba(0,0,0,0.35)]"
                  >
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
                        <img
                          src={heroImage}
                          alt={collection.title}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        {primaryWindow && (
                          <div className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1 text-sm font-semibold text-yametee-dark shadow-lg">
                            <span className="h-2 w-2 rounded-full bg-yametee-red" />
                            {humanizeReleaseStatus(primaryWindow.status)}
                          </div>
                        )}
                      </div>

                      <div className="p-8 flex flex-col gap-6 text-white">
                        <div className="space-y-2">
                          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                            Drop #{collection.launchDate?.getFullYear() ?? '—'}
                          </p>
                          <h2 className="text-3xl font-bold">{collection.title}</h2>
                          {collection.subtitle && <p className="text-lg text-gray-300">{collection.subtitle}</p>}
                        </div>

                        {releaseLabel && <p className="text-sm text-gray-400">{releaseLabel}</p>}

                        <p className="text-gray-200 line-clamp-3">{collection.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2">
                            {collection.products.length} pieces
                          </span>
                          {previewProduct?.variants?.length ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2">
                              Sizes:{' '}
                              {[...new Set(previewProduct.variants.map((variant) => variant.size))].join(' / ')}
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-auto flex flex-col gap-3">
                          {previewProduct && (
                            <div>
                              <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Headliner</p>
                              <p className="text-lg font-semibold">{previewProduct.name}</p>
                            </div>
                          )}

                          <div className="flex gap-4">
                            <Link
                              href={`/collections/${collection.slug}`}
                              className="flex-1 rounded-full bg-white text-yametee-dark px-6 py-3 text-center font-semibold uppercase tracking-wider shadow-lg shadow-yametee-red/30 transition hover:-translate-y-0.5"
                            >
                              View Collection
                            </Link>
                            <Link
                              href="/products"
                              className="rounded-full border border-white/30 px-6 py-3 text-center font-semibold uppercase tracking-wider text-white transition hover:bg-white/10"
                            >
                              Shop All
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
