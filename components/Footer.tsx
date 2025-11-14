import Link from 'next/link'

const quickLinks = [
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Size Guide', href: '/size-guide' },
  { label: 'FAQ', href: '/faq' },
]

const supportLinks = [
  { label: 'Shipping & Delivery', href: '/shipping' },
  { label: 'Returns & Exchanges', href: '/returns' },
  { label: 'Contact', href: '/contact' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
]

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-gray-200 bg-gray-50 text-gray-900 dark:border-white/10 dark:bg-street-carbon/80 dark:text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.5em] text-gray-500 dark:text-white/50">Yame-Tee Manila</p>
            <h2 className="font-display text-4xl uppercase tracking-[0.3em]">
              Streetwear for <span className="text-yametee-red dark:text-street-lime">T-Shirt</span> purists.
            </h2>
            <p className="max-w-2xl text-base text-gray-600 dark:text-white/70">
              Yame-Tee builds heavyweight graphic tees inspired by anime, skate decks, and Manila nights. Oversized,
              breathable, and made to be your everyday uniform.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Heavyweight 240GSM', 'Pre-shrunk', 'Silkscreened', 'Limited Drops'].map((tag) => (
                <span key={tag} className="stat-pill text-xs uppercase tracking-[0.3em] text-gray-600 dark:text-white/80">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <p className="text-xs uppercase tracking-[0.4em] text-gray-500 dark:text-white/60">Stay Early</p>
            <h3 className="mt-3 text-2xl font-semibold">Be first to cop every drop.</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-white/70">
              Weekly tee sketches, drop timers, and studio stories straight to your inbox.
            </p>
            <div className="mt-5 space-y-3">
              <input
                type="email"
                placeholder="email@yame-tee.com"
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-yametee-red focus:outline-none dark:border-white/10 dark:bg-black/40 dark:text-white dark:placeholder:text-white/40 dark:focus:border-street-lime/60"
              />
              <button className="w-full rounded-2xl bg-yametee-red px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-neon transition hover:-translate-y-0.5 dark:bg-street-lime dark:text-street-carbon">
                Join The List
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 border-t border-gray-200 pt-8 text-sm text-gray-600 dark:border-white/10 dark:text-white/70 md:grid-cols-3">
          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-white/60">Quick Links</h4>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-yametee-red dark:hover:text-street-lime">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-white/60">Support</h4>
            <ul className="mt-4 space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-yametee-red dark:hover:text-street-lime">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-white/60">Legal</h4>
            <ul className="mt-4 space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-yametee-red dark:hover:text-street-lime">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-gray-200 pt-6 text-xs text-gray-500 dark:border-white/10 dark:text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Yame-Tee Studio. All rights reserved.</p>
          <p className="uppercase tracking-[0.4em]">Built for tees · Made in Manila</p>
        </div>
      </div>
    </footer>
  )
}
