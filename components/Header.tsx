'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'
import AnnouncementBar from './AnnouncementBar'
import Logo from './Logo'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [cartCount, setCartCount] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const updateCartCount = async () => {
      try {
        const response = await fetch('/api/cart/count')
        const data = await response.json()
        if (response.ok) {
          setCartCount(data.count || 0)
        }
      } catch (error) {
        console.error('Failed to get cart count:', error)
        setCartCount(0)
      }
    }

    updateCartCount()
    const handleCartUpdate = () => {
      updateCartCount()
    }
    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [])

  const navLinks = [
    { href: '/products', label: 'SHOP TEES' },
    { href: '/drops', label: 'DROPS' },
    { href: '/products', label: 'FEATURED' },
    { href: '/about', label: 'STORY' },
    { href: '/contact', label: 'SUPPORT' },
  ]

  return (
    <>
      <AnnouncementBar />
      
      {/* Top Strip */}
      <div className="bg-yametee-gray dark:bg-yametee-gray border-b border-yametee-lightGray/20">
        <div className="container mx-auto px-4 py-1.5">
          <div className="flex items-center justify-center gap-4 text-xs md:text-sm text-gray-300 dark:text-gray-400">
            <span>DROP 07</span>
            <span className="text-yametee-red">•</span>
            <span>MANILA STUDIO</span>
            <span className="text-yametee-red">•</span>
            <span>PREMIUM GRAPHIC TEES</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-50 bg-yametee-bg/95 backdrop-blur-md border-b border-yametee-lightGray/20 transition-colors duration-300">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <Logo size="default" />
            </Link>
            
            {/* Center Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isProductsLink = link.href === '/products'
                const isDropsLink = link.href === '/drops'
                const isActive =
                  pathname === link.href ||
                  (isProductsLink && pathname?.startsWith('/products')) ||
                  (isDropsLink && pathname?.startsWith('/drops'))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      text-sm font-medium uppercase tracking-wide transition-colors
                      ${isActive 
                        ? 'text-yametee-red bg-yametee-gray dark:bg-yametee-lightGray px-3 py-1.5 rounded' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-yametee-red'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
            
            {/* Right Side - Theme Toggle, Cart */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link 
                href="/cart" 
                className="relative text-gray-700 dark:text-gray-300 hover:text-yametee-red transition-colors font-medium uppercase text-sm tracking-wide"
              >
                CART
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yametee-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden mt-4 pb-2 flex items-center gap-4 overflow-x-auto scrollbar-hide">
            {navLinks.map((link) => {
              const isProductsLink = link.href === '/products'
              const isDropsLink = link.href === '/drops'
              const isActive =
                pathname === link.href ||
                (isProductsLink && pathname?.startsWith('/products')) ||
                (isDropsLink && pathname?.startsWith('/drops'))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    text-xs font-medium uppercase tracking-wide whitespace-nowrap transition-colors
                    ${isActive 
                      ? 'text-yametee-red' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-yametee-red'
                    }
                  `}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </nav>
      </header>
    </>
  )
}
