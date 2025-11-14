'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'

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
    <header className="sticky top-0 z-50 bg-yametee-gray/95 backdrop-blur-md border-b border-yametee-lightGray/30 shadow-lg transition-colors duration-300">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Image 
            src="/images/logos/logo-main.png" 
            alt="YAMETEE Logo" 
            width={120}
            height={40}
            className="h-8 md:h-10 w-auto invert dark:invert-0 transition-all duration-300"
            priority
          />
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/products" className="text-gray-700 dark:text-gray-200 hover:text-yametee-red transition-colors font-medium">
            Products
          </Link>
          <Link href="/cart" className="relative text-gray-700 dark:text-gray-200 hover:text-yametee-red transition-colors font-medium">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yametee-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                {cartCount}
              </span>
            )}
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
