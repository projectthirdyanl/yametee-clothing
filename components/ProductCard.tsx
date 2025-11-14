/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

type ProductCardProduct = {
  id: string
  slug: string
  name: string
  brand?: string | null
  images: { id: string; imageUrl: string }[]
  variants: { id: string; price: any }[]
}

interface ProductCardProps {
  product: ProductCardProduct
  badge?: string
}

const BADGES = ['Oversized Fit', 'Premium Cotton', 'Limited Drop', 'Street Uniform']

export default function ProductCard({ product, badge }: ProductCardProps) {
  const variant = product.variants?.[0]
  const price = variant ? formatPrice(parseFloat(variant.price.toString())) : null
  const image = product.images?.[0]?.imageUrl
  const headline = badge || BADGES[Math.floor(Math.random() * BADGES.length)]

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-lg transition-all hover:-translate-y-1 hover:border-yametee-red/40 hover:bg-white dark:border-white/5 dark:bg-street-carbon/50 dark:shadow-brand"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-street-graphite dark:via-street-carbon dark:to-black">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,var(--yametee-red)_0%,transparent_55%)] opacity-10 transition-opacity duration-300 group-hover:opacity-40 dark:opacity-30" />
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm uppercase tracking-[0.3em] text-white/30">
            GNARLY TEE
          </div>
        )}

        <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-street-lime">
          {headline}
        </span>
        <div className="absolute bottom-4 right-4 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
          240GSM
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-gray-500 dark:text-white/50">
          <span>{product.brand || 'Yame-Tee'}</span>
          <span>DROP</span>
        </div>

        <h3 className="text-2xl font-display tracking-[0.08em] text-gray-900 transition-colors group-hover:text-yametee-red dark:text-white dark:group-hover:text-street-lime">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          {price ? (
            <p className="text-xl font-semibold text-yametee-red dark:text-street-lime">{price}</p>
          ) : (
            <p className="text-gray-500 dark:text-white/60">Coming soon</p>
          )}
          <span className="rounded-full border border-gray-200 px-3 py-1 text-xs uppercase tracking-[0.3em] text-gray-600 dark:border-white/10 dark:text-white/70">
            Tees
          </span>
        </div>
      </div>
    </Link>
  )
}
