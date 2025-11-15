import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'

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
          orderBy: { price: 'asc' },
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
  const heroStats = [
    { label: 'GSM Weight', value: '240GSM' },
    { label: 'Fits Tested', value: '12 Protos' },
    { label: 'Restocks', value: 'Never' },
  ]

  const teeFeatures = [
    {
      title: 'Cut & Sewn',
      description: 'Boxy drop shoulder silhouette with reinforced collar that never warps.',
      meta: 'Pattern V3',
    },
    {
      title: 'Ink Locked',
      description: 'Hybrid silkscreen + puff layers for art that survives Manila humidity.',
      meta: '12k presses',
    },
    {
      title: 'Skate Proof',
      description: 'Pre-shrunk, pre-washed, ready for rides, raids, and red-eye gigs.',
      meta: 'Field tested',
    },
  ]

  const lookbook = [
    {
      title: 'Studio Lookbook',
      copy: 'Monochrome with violent reds. Built for alley kickflips & late-night ramen runs.',
      cta: 'View products',
      href: '/products',
    },
    {
      title: 'Fabric Story',
      copy: '100% premium cotton spun for airflow but weighted for structure. Zero cling.',
      cta: 'Size guide',
      href: '/size-guide',
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden px-4 pb-24 pt-12">
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-yametee-red/30 blur-[120px]" />
            <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-street-lime/20 blur-[150px]" />
          </div>

          <div className="container mx-auto grid gap-12 lg:grid-cols-[1.4fr,1fr]">
            <div className="relative space-y-8">
              <p className="tag-chip text-street-lime">Drop 07 / Manila Studio</p>
              <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
                Graphic tees engineered like skate hardware. Oversized. Overbuilt. Unapologetic.
              </h1>
              <p className="max-w-2xl text-lg text-white/75">
                Yametee is a Filipino streetwear lab obsessed with anime iconography and the chaos of Metro Manila.
                Every drop is a capsule of loud tees designed to survive commutes, skates, and sweaty gigs.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="rounded-full bg-street-lime px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-street-carbon shadow-neon transition hover:-translate-y-0.5"
                >
                  Shop the drop
                </Link>
                <Link
                  href="/size-guide"
                  className="rounded-full border border-white/20 px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:border-white/60"
                >
                  Size guide
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm uppercase tracking-[0.4em] text-white/60">{stat.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-shell relative bg-street-carbon/60">
              <div className="absolute inset-x-0 top-6 h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <p className="text-xs uppercase tracking-[0.4em] text-street-lime">Signature Tee Spec</p>
                <h2 className="mt-6 font-display text-4xl tracking-[0.2em] text-white">
                  SIGNATURE CUT
                <span className="block text-street-lime">/ 240GSM</span>
              </h2>
              <p className="mt-4 text-white/70">
                Built with reinforced neck taping, double needle hems, and side-split vents for movement. Printed
                using eight passes of ink to keep the anime details loud.
              </p>
              <ul className="mt-8 space-y-4 text-sm text-white/80">
                <li className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span>Fabric</span>
                  <span className="font-semibold text-street-lime">100% Cotton / 240GSM</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span>Fit</span>
                  <span className="font-semibold text-street-lime">Oversized Drop Shoulder</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Print</span>
                  <span className="font-semibold text-street-lime">Silkscreen + Puff Layers</span>
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                {['Pre-Shrunk', 'Anti-fade', 'Studio Tested'].map((tag) => (
                  <span key={tag} className="stat-pill text-xs text-white/70">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="marquee">
          <div className="marquee-track">
            <span>Yametee Street Labs</span>
            <span>Premium Anime Tees</span>
            <span>Oversized 240 GSM</span>
            <span>Limited Drops Only</span>
            <span>Yametee Street Labs</span>
            <span>Premium Anime Tees</span>
            <span>Oversized 240 GSM</span>
            <span>Limited Drops Only</span>
          </div>
        </div>

        <section className="px-4 py-16" id="story">
          <div className="container mx-auto grid gap-6 md:grid-cols-3">
            {teeFeatures.map((feature) => (
              <div
                key={feature.title}
                className="section-shell bg-gradient-to-br from-street-graphite/80 to-street-carbon/80 text-white"
              >
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">{feature.meta}</p>
                <h3 className="mt-4 text-2xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm text-white/70">{feature.description}</p>
                <div className="mt-6 h-[1px] w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </div>
            ))}
          </div>
        </section>

        {products.length > 0 && (
          <section className="px-4 py-20" id="drops">
            <div className="container mx-auto space-y-10">
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">Featured Capsule</p>
                  <h2 className="font-display text-4xl tracking-[0.2em] text-white">Latest Tee Drops</h2>
                </div>
                <Link
                  href="/products"
                  className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-[0.4em] text-white transition hover:border-street-lime/60"
                >
                  View full catalog
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="px-4 pb-20" id="lookbook">
          <div className="container mx-auto grid gap-8 lg:grid-cols-2">
            {lookbook.map((entry) => (
              <div
                key={entry.title}
                className="section-shell flex h-full flex-col justify-between bg-gradient-to-br from-black/70 via-street-graphite/60 to-black"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50">{entry.title}</p>
                  <h3 className="mt-4 font-display text-3xl tracking-[0.25em] text-white">{entry.copy}</h3>
                </div>
                <Link
                  href={entry.href}
                  className="mt-8 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.4em] text-street-lime"
                >
                  {entry.cta}
                  <span className="h-px w-12 bg-street-lime" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 pb-24">
          <div className="container mx-auto rounded-[32px] border border-white/10 bg-street-carbon/70 p-8 text-white">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Fabric Manifesto</p>
                <h3 className="mt-4 font-display text-4xl tracking-[0.2em]">
                  T-shirts that age like your favorite kicks.
                </h3>
                <p className="mt-3 text-white/70">
                  We prototyped twelve base patterns to perfect our drop shoulder. Each tee is garment dyed, enzyme
                  washed, and heat set to lock the print forever. Throw it in the wash, thrash it at the park—it only
                  gets better.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {['Fade-Proof Art', 'Side Split Hem', 'Reinforced Collar', 'Soft Hand Feel'].map((callout) => (
                  <span key={callout} className="stat-pill text-xs text-white/80">
                    {callout}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
