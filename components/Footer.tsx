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
    <footer className="mt-24 border-t border-white/10 bg-street-carbon/80 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.5em] text-white/50">Yametee Manila</p>
            <h2 className="font-display text-4xl uppercase tracking-[0.3em] text-white">
              Streetwear for <span className="text-street-lime">T-Shirt</span> purists.
            </h2>
            <p className="max-w-2xl text-base text-white/70">
              Built like your favorite skate decks—rugged, oversized, pre-shrunk. Designed for Manila humidity
              with breathable 240GSM cotton and prints that never crack. This is your daily uniform.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Heavyweight 240GSM', 'Pre-shrunk', 'Silkscreened', 'Limited Drops'].map((tag) => (
                <span key={tag} className="stat-pill text-xs uppercase tracking-[0.3em] text-white/80">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Stay Early</p>
            <h3 className="mt-3 text-2xl font-semibold">Be first to cop every drop.</h3>
            <p className="mt-2 text-sm text-white/70">
              Weekly tee sketches, drop timers, and studio stories straight to your inbox.
            </p>
            <div className="mt-5 space-y-3">
              <input
                type="email"
                placeholder="email@yametee.club"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-street-lime/60 focus:outline-none"
              />
              <button className="w-full rounded-2xl bg-street-lime px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-street-carbon shadow-neon transition hover:-translate-y-0.5">
                Join The List
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-3">
          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-white/60">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-street-lime">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-white/60">Support</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-street-lime">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-white/60">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-street-lime">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Yametee Studio. All rights reserved.</p>
          <p className="uppercase tracking-[0.4em]">Built for tees · Made in Manila</p>
        </div>
      </div>
    </footer>
  )
}
