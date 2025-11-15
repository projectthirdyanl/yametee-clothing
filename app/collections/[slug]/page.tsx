import type { Prisma } from '@prisma/client'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'
import {
  formatReleaseLabel,
  formatWindowRange,
  getPrimaryReleaseWindow,
  humanizeReleaseStatus,
} from '@/lib/releases'

type StorySection = {
  title?: string
  body?: string
}

type ParsedStory = {
  tagline?: string
  sections: StorySection[]
}

function parseStory(story: Prisma.JsonValue | null): ParsedStory | null {
  if (!story || typeof story !== 'object' || Array.isArray(story)) {
    return null
  }

  const payload = story as Record<string, any>
  const sections = Array.isArray(payload.sections)
    ? payload.sections
        .map((section) => ({
          title: typeof section.title === 'string' ? section.title : undefined,
          body: typeof section.body === 'string' ? section.body : typeof section.content === 'string' ? section.content : undefined,
        }))
        .filter((section) => section.title || section.body)
    : []

  return {
    tagline: typeof payload.tagline === 'string' ? payload.tagline : undefined,
    sections,
  }
}

function getHeroImage(collection: { heroImage: string | null; lookbookImages: string[]; products: any[] }) {
  const sortedProducts = [...collection.products].sort((a, b) => a.displayOrder - b.displayOrder)
  return (
    collection.heroImage ||
    collection.lookbookImages[0] ||
    sortedProducts[0]?.product?.images[0]?.imageUrl ||
    '/images/logos/logo-main.png'
  )
}

async function getCollection(slug: string) {
  try {
    return await prisma.collection.findUnique({
      where: { slug },
      include: {
        products: {
          orderBy: { displayOrder: 'asc' },
          include: {
            product: {
              include: {
                images: {
                  orderBy: { position: 'asc' },
                  take: 2,
                },
                variants: {
                  orderBy: { price: 'asc' },
                },
              },
            },
          },
        },
        releaseWindows: {
          orderBy: { startsAt: 'asc' },
        },
        promotions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  } catch (error) {
    console.error('Error fetching collection', error)
    return null
  }
}

export default async function CollectionDetailPage({ params }: { params: { slug: string } }) {
  const collection = await getCollection(params.slug)

  if (!collection || collection.status !== 'PUBLISHED') {
    notFound()
  }

  const story = parseStory(collection.story)
  const heroImage = getHeroImage(collection)
  const releaseLabel = formatReleaseLabel(collection.releaseWindows, {
    fallbackDate: collection.launchDate,
    style: 'long',
  })
  const primaryWindow = getPrimaryReleaseWindow(collection.releaseWindows)
  const productEntries = [...collection.products].sort((a, b) => a.displayOrder - b.displayOrder)
  const activePromotions = collection.promotions.filter((promo) => promo.status === 'ACTIVE')

  return (
    <div className="min-h-screen flex flex-col bg-yametee-bg">
      <Header />
      <main className="flex-1">
        <section className="relative h-[60vh] min-h-[480px] overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroImage} alt={collection.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/80" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-end px-4 pb-12">
            <div className="container mx-auto text-white space-y-4">
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.4em] text-gray-300">
                <span>Yametee Drop</span>
                <span className="h-px w-12 bg-white/40" />
                <span>{collection.launchDate?.getFullYear() ?? '—'}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black">{collection.title}</h1>
              {collection.subtitle && <p className="text-xl text-gray-200 max-w-3xl">{collection.subtitle}</p>}
              {releaseLabel && <p className="text-sm text-gray-300">{releaseLabel}</p>}

              <div className="flex flex-wrap gap-3">
                {primaryWindow && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                    <span className="h-2 w-2 rounded-full bg-yametee-red" />
                    {humanizeReleaseStatus(primaryWindow.status)}
                  </span>
                )}
                <span className="inline-flex rounded-full border border-white/30 px-4 py-2 text-sm font-semibold">
                  {collection.products.length} pieces
                </span>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="#products"
                  className="rounded-full bg-white text-yametee-dark px-8 py-3 text-center font-semibold uppercase tracking-widest shadow-lg shadow-yametee-red/30 transition hover:-translate-y-0.5"
                >
                  Shop the collection
                </Link>
                <Link
                  href="/collections"
                  className="rounded-full border border-white/40 px-8 py-3 font-semibold uppercase tracking-widest text-white transition hover:bg-white/10"
                >
                  All drops
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 grid lg:grid-cols-3 gap-10">
          <article className="lg:col-span-2 space-y-6">
            <p className="text-lg text-gray-200">{collection.description}</p>

            {story?.tagline && <p className="text-sm uppercase tracking-[0.4em] text-gray-500">{story.tagline}</p>}

            {story?.sections.map((section, index) => (
              <div key={index} className="space-y-2">
                {section.title && <h3 className="text-2xl font-semibold text-white">{section.title}</h3>}
                {section.body && <p className="text-gray-300 leading-relaxed">{section.body}</p>}
              </div>
            ))}

            {collection.lookbookImages.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {collection.lookbookImages.map((image, index) => (
                  <div
                    key={image}
                    className={`overflow-hidden rounded-2xl border border-yametee-lightGray/20 ${
                      index % 2 === 0 ? 'sm:translate-y-4' : 'sm:-translate-y-4'
                    }`}
                  >
                    <img src={image} alt={`Lookbook ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </article>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-yametee-lightGray/30 bg-yametee-dark p-6 text-white space-y-4">
              <h3 className="text-xl font-semibold">Release windows</h3>
              <div className="space-y-4">
                {collection.releaseWindows.length === 0 && (
                  <p className="text-gray-400 text-sm">No release windows configured yet.</p>
                )}
                {collection.releaseWindows.map((window) => (
                  <div key={window.id} className="rounded-2xl border border-white/10 p-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">{humanizeReleaseStatus(window.status)}</span>
                      <span className="text-gray-400">{window.allowlistOnly ? 'Allowlist' : 'Public'}</span>
                    </div>
                    <p className="text-gray-200">{formatWindowRange(window)}</p>
                    {window.notes && <p className="text-xs text-gray-400">{window.notes}</p>}
                  </div>
                ))}
              </div>
            </div>

            {activePromotions.length > 0 && (
              <div className="rounded-3xl border border-yametee-red/40 bg-gradient-to-br from-yametee-red/20 to-transparent p-6 text-white space-y-4">
                <h3 className="text-xl font-semibold">Active incentives</h3>
                <ul className="space-y-3">
                  {activePromotions.map((promotion) => (
                    <li key={promotion.id} className="rounded-2xl border border-yametee-red/40 p-4">
                      <p className="text-sm uppercase tracking-[0.3em] text-gray-300">{promotion.code ?? 'Automatic'}</p>
                      <p className="text-lg font-semibold">{promotion.name}</p>
                      {promotion.description && <p className="text-sm text-gray-300 mt-1">{promotion.description}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </section>

        <section id="products" className="container mx-auto px-4 pb-20 space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-gray-500">Pieces</p>
              <h2 className="text-3xl font-bold text-white">{collection.title} lineup</h2>
            </div>
            <Link
              href="/products"
              className="rounded-full border border-white/20 px-6 py-2 text-sm font-semibold uppercase tracking-widest text-white hover:bg-white/10"
            >
              View all products
            </Link>
          </div>

          {productEntries.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-yametee-lightGray/30 p-12 text-center text-gray-400">
              No products linked to this collection yet.
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {productEntries.map((entry) => {
                const product = entry.product
                const image = product.images[0]
                const price = product.variants[0]?.price
                const sizes = [...new Set(product.variants.map((variant) => variant.size))]

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group rounded-3xl border border-yametee-lightGray/20 bg-yametee-dark/80 overflow-hidden transition hover:-translate-y-1 hover:border-yametee-red/50"
                  >
                    {image && (
                      <div className="aspect-square overflow-hidden bg-yametee-gray/40">
                        <img
                          src={image.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6 space-y-3 text-white">
                      <div className="flex items-center justify-between">
                        <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Drop #{entry.displayOrder + 1}</p>
                        {price && <p className="text-lg font-semibold text-yametee-red">₱{Number(price).toFixed(2)}</p>}
                      </div>
                      <h3 className="text-xl font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
                      {sizes.length > 0 && (
                        <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Sizes: {sizes.join(' / ')}</p>
                      )}
                    </div>
                  </Link>
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
