'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import ImageCarousel from './ImageCarousel'
import { 
  CheckIcon, 
  TruckIcon, 
  ShieldCheckIcon,
  HeartIcon,
  ShareIcon 
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface Variant {
  id: string
  size: string
  color: string
  price: any
  stockQuantity: number
  sku: string
}

interface ProductImage {
  id: string
  imageUrl: string
  color?: string | null
  isPrimary: boolean
}

interface Product {
  id: string
  name: string
  description: string
  brand: string
  images: ProductImage[]
  variants: Variant[]
}

interface ProductDetailClientProps {
  product: Product
}

const SIZES = ['S', 'M', 'L', 'XL', '2XL']

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  )

  const availableSizes = Array.from(
    new Set(
      product.variants
        .filter((v) => v.color === selectedColor && v.stockQuantity > 0)
        .map((v) => v.size)
    )
  )

  // Get all colors that exist in variants (enabled in admin) - regardless of stock
  // This ensures colors enabled in admin are visible in store, even if out of stock
  const enabledColors = Array.from(
    new Set(product.variants.map((v) => v.color))
  ).sort()

  // Get all colors that have stock available (for any size)
  const availableColors = Array.from(
    new Set(
      product.variants
        .filter((v) => v.stockQuantity > 0)
        .map((v) => v.color)
    )
  )
  
  // Get colors available for selected size (used for size filtering)
  const availableColorsForSize = Array.from(
    new Set(
      product.variants
        .filter((v) => v.size === selectedSize && v.stockQuantity > 0)
        .map((v) => v.color)
    )
  )

  // Auto-select first available color and size on mount
  useEffect(() => {
    if (!selectedColor && product.variants.length > 0) {
      const firstAvailableColor = product.variants.find((v) => v.stockQuantity > 0)?.color
      if (firstAvailableColor) {
        setSelectedColor(firstAvailableColor)
      }
    }
  }, [product.variants, selectedColor])

  useEffect(() => {
    if (selectedColor && !selectedSize && availableSizes.length > 0) {
      setSelectedSize(availableSizes[0])
    }
  }, [selectedColor, availableSizes, selectedSize])

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Please select size and color')
      return
    }

    if (selectedVariant.stockQuantity < quantity) {
      alert('Not enough stock available')
      return
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.findIndex(
      (item: any) => item.variantId === selectedVariant.id
    )

    if (existingItem >= 0) {
      cart[existingItem].quantity += quantity
    } else {
      cart.push({
        productId: product.id,
        variantId: selectedVariant.id,
        size: selectedSize,
        color: selectedColor,
        quantity,
        price: selectedVariant.price,
        productName: product.name,
        imageUrl: product.images[0]?.imageUrl || '',
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    
    // Show success notification
    const notification = document.createElement('div')
    notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in'
    notification.textContent = '✓ Added to cart!'
    document.body.appendChild(notification)
    setTimeout(() => notification.remove(), 3000)
    
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const stockStatus = selectedVariant
      ? selectedVariant.stockQuantity > 10
        ? { text: 'In Stock', color: 'text-street-lime', bg: 'bg-street-lime/10', border: 'border-street-lime/30' }
        : selectedVariant.stockQuantity > 0
        ? { text: 'Low Stock', color: 'text-amber-300', bg: 'bg-amber-400/10', border: 'border-amber-300/30' }
        : { text: 'Out of Stock', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' }
      : { text: 'Select Size & Color', color: 'text-white/70', bg: 'bg-white/5', border: 'border-white/15' }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on Yametee!`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr,0.95fr]">
        {/* Image Gallery with Carousel */}
        <div className="rounded-[32px] border border-white/10 bg-street-carbon/70 p-6">
          <ImageCarousel
            images={product.images}
            selectedColor={selectedColor}
            productName={product.name}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-8 rounded-[32px] border border-white/10 bg-black/60 p-8 text-white">
            {/* Headline & Title */}
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-street-lime">
                Studio Capsule
              </p>
            <h1 className="mt-2 font-display text-4xl lg:text-5xl tracking-[0.08em] text-white">
              {product.name}
            </h1>
            
            {selectedVariant && (
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <p className="text-4xl font-semibold text-street-lime">
                  {formatPrice(selectedVariant.price)}
                </p>
                <p className="text-white/40 line-through text-xl">₱799</p>
                <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/80">
                  Limited Drop
                </span>
              </div>
            )}
          </div>

            {/* Stock Status */}
            <div className={`inline-flex items-center gap-3 rounded-full border px-5 py-2 ${stockStatus.bg} ${stockStatus.border}`}>
              <CheckIcon className={`w-5 h-5 ${stockStatus.color}`} />
              <span className={`text-sm font-semibold ${stockStatus.color}`}>{stockStatus.text}</span>
              {selectedVariant && selectedVariant.stockQuantity > 0 && (
                <span className="text-xs uppercase tracking-[0.3em] text-white/60">
                  {selectedVariant.stockQuantity} pcs left
                </span>
              )}
            </div>

          {/* Color Selection */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                Color: <span className="font-normal text-white/60">{selectedColor || 'Select'}</span>
              </h3>
              <div className="flex flex-wrap gap-3">
              {enabledColors.map((color) => {
                // Check if color has any variants (enabled in admin)
                const hasVariant = product.variants.some((v) => v.color === color)
                // Check if color has stock available
                const hasStock = product.variants.some(
                  (v) => v.color === color && v.stockQuantity > 0
                )
                const isSelected = selectedColor === color
                
                return (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color)
                        if (!availableSizes.includes(selectedSize)) {
                          setSelectedSize('')
                        }
                      }}
                      disabled={!hasVariant}
                      className={`rounded-2xl px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition-all ${
                        isSelected
                          ? 'border border-street-lime bg-street-lime/10 text-street-lime shadow-neon'
                          : hasStock
                          ? 'border border-white/15 bg-white/5 text-white hover:border-street-lime/40'
                          : hasVariant
                          ? 'border border-white/10 bg-white/5 text-white/60 opacity-70'
                          : 'border border-white/5 bg-black/40 text-white/30 opacity-50 cursor-not-allowed'
                      }`}
                    >
                    {color}
                    {hasVariant && !hasStock && (
                      <span className="ml-2 text-xs opacity-75">(Out of Stock)</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

            {/* Size Selection */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                Size: <span className="font-normal text-white/60">{selectedSize || 'Select'}</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {SIZES.map((size) => {
                  const isAvailable = selectedColor
                    ? availableSizes.includes(size)
                    : product.variants.some((v) => v.size === size && v.stockQuantity > 0)
                  const isSelected = selectedSize === size
                  
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`h-14 w-14 rounded-2xl text-base font-semibold transition-all ${
                        isSelected
                          ? 'border border-street-lime bg-street-lime/10 text-street-lime shadow-neon'
                          : isAvailable
                          ? 'border border-white/15 bg-white/5 text-white hover:border-street-lime/40'
                          : 'border border-white/5 bg-black/40 text-white/30 cursor-not-allowed opacity-50'
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
              <Link
                href="/size-guide"
                className="mt-2 inline-block text-sm text-white/60 underline-offset-4 hover:text-street-lime"
              >
                Size Guide
              </Link>
            </div>

          {/* Quantity */}
            {selectedVariant && selectedVariant.stockQuantity > 0 && (
              <div>
                <label className="mb-2 block font-semibold text-white">Quantity</label>
                <div className="flex w-fit items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-white transition hover:border-street-lime/40"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-xl font-semibold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(selectedVariant.stockQuantity, quantity + 1))
                    }
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-white transition hover:border-street-lime/40"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stockQuantity === 0}
                className="flex-1 rounded-full bg-yametee-red px-8 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-neon transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
              >
                Add to Cart
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex h-14 w-14 items-center justify-center rounded-full border transition ${
                  isWishlisted
                    ? 'border-yametee-red bg-yametee-red text-white'
                    : 'border-white/15 bg-white/5 text-white hover:border-street-lime/40'
                }`}
              >
                {isWishlisted ? (
                  <HeartSolidIcon className="w-6 h-6" />
                ) : (
                  <HeartIcon className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={handleShare}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-street-lime/40"
              >
                <ShareIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-1 gap-4 border-t border-white/10 pt-6 text-white sm:grid-cols-3">
              <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <TruckIcon className="mb-2 h-8 w-8 text-street-lime" />
                <p className="text-sm font-semibold">Free Shipping</p>
                <p className="text-xs text-white/60">Over ₱1,000</p>
              </div>
              <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <ShieldCheckIcon className="mb-2 h-8 w-8 text-street-lime" />
                <p className="text-sm font-semibold">Secure Payment</p>
                <p className="text-xs text-white/60">100% Protected</p>
              </div>
              <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <CheckIcon className="mb-2 h-8 w-8 text-street-lime" />
                <p className="text-sm font-semibold">Easy Returns</p>
                <p className="text-xs text-white/60">7 Days Return</p>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-t border-white/10 pt-6">
                <h3 className="mb-4 text-xl font-semibold text-white">Product Details</h3>
                <div
                  className="prose prose-invert max-w-none text-white/80"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {/* Additional Info */}
            <div className="space-y-3 border-t border-white/10 pt-6 text-white/70">
              <div className="flex justify-between">
                <span>SKU</span>
                <span className="font-semibold text-white">{selectedVariant?.sku || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Material</span>
                <span className="font-semibold text-white">100% Cotton</span>
              </div>
              <div className="flex justify-between">
                <span>Care Instructions</span>
                <span className="font-semibold text-white">Machine Wash Cold</span>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}
