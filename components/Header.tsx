'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { label: 'Drops', href: '/#drops' },
  { label: 'Lookbook', href: '/#lookbook' },
  { label: 'Story', href: '/about' },
  { label: 'Support', href: '/faq' },
]

export default function Header() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const updateCartCount = () => {
      if (typeof window !== 'undefined') {
        const cart = localStorage.getItem('cart')
        if (cart) {
          const items = JSON.parse(cart)
          const count = items.reduce((sum: number, item: any) => sum + item.quantity, 0)
          setCartCount(count)
        } else {
          setCartCount(0)
        }
      }
    }

    updateCartCount()
    window.addEventListener('cartUpdated', updateCartCount)
    return () => window.removeEventListener('cartUpdated', updateCartCount)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-street-carbon/80 backdrop-blur-2xl shadow-brand">
      <div className="border-b border-white/10 bg-white/5 px-4 py-2 text-center text-[10px] uppercase tracking-[0.6em] text-white/60">
        Drop 07 · Manila Studio · Premium Graphic Tees
      </div>
      <nav className="container mx-auto flex items-center justify-between gap-6 px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/80 shadow-lg shadow-red-500/20">
            <Image
              src="/images/logos/logo-main.png"
              alt="YAMETEE Logo"
              width={40}
              height={40}
              className="h-8 w-8 invert dark:invert-0 transition-all duration-300"
              priority
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Yametee</p>
            <p className="font-display text-2xl tracking-[0.25em] text-white">Street Uniform</p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 text-sm uppercase tracking-[0.3em] text-white/70 md:flex">
          <Link
            href="/products"
            className="rounded-full border border-white/10 px-4 py-2 text-white transition-colors hover:border-white/40"
          >
            Shop Tees
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/60 transition-colors hover:text-street-lime"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="md:hidden rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.3em] text-white/70"
          >
            Shop
          </Link>
          <ThemeToggle />
          <Link
            href="/cart"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:border-street-lime/40"
          >
            <span>Cart</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-street-lime/90 text-sm font-bold text-street-carbon shadow-neon">
              {cartCount}
            </span>
          </Link>
        </div>
      </nav>
    </header>
  )
}
