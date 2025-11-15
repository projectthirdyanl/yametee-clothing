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
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-street-carbon/50 p-4 shadow-brand transition-all hover:-translate-y-1 hover:border-white/15 hover:bg-street-carbon/80"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-street-graphite via-street-carbon to-black">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,var(--yametee-red)_0%,transparent_55%)] opacity-30 transition-opacity duration-300 group-hover:opacity-60" />
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm uppercase tracking-[0.3em] text-white/30">
              SIGNATURE TEE
            </div>
          )}

        <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-street-lime">
          {headline}
        </span>
        <div className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
          240GSM
        </div>
      </div>

        <div className="mt-5 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-white/50">
            <span>Studio Capsule</span>
            <span>Drop</span>
          </div>

          <h3 className="text-2xl font-display tracking-[0.08em] text-white transition-colors group-hover:text-street-lime">
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
            {price ? (
              <p className="text-xl font-semibold text-street-lime">{price}</p>
            ) : (
              <p className="text-white/60">Coming soon</p>
            )}
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
              Tees
            </span>
          </div>
        </div>
    </Link>
  )
}
