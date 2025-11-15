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

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert('Please select size and color')
      return
    }

    if (selectedVariant.stockQuantity < quantity) {
      alert('Not enough stock available')
      return
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: selectedVariant.id,
          quantity,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add to cart')
      }

      // Show success notification
      const notification = document.createElement('div')
      notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in'
      notification.textContent = '✓ Added to cart!'
      document.body.appendChild(notification)
      setTimeout(() => notification.remove(), 3000)
      
      // Dispatch event to update cart count in header
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (error: any) {
      alert(error.message || 'Failed to add to cart')
    }
  }

  const stockStatus = selectedVariant
    ? selectedVariant.stockQuantity > 10
      ? { text: 'In Stock', color: 'text-green-400', bg: 'bg-green-500/10' }
      : selectedVariant.stockQuantity > 0
      ? { text: 'Low Stock', color: 'text-yellow-400', bg: 'bg-yellow-500/10' }
      : { text: 'Out of Stock', color: 'text-red-400', bg: 'bg-red-500/10' }
    : { text: 'Select Size & Color', color: 'text-gray-400', bg: 'bg-gray-500/10' }

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
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery with Carousel */}
        <div>
          <ImageCarousel
            images={product.images}
            selectedColor={selectedColor}
            productName={product.name}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand & Title */}
          <div>
            <p className="text-yametee-red font-semibold text-sm uppercase tracking-wide mb-2">
              {product.brand}
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h1>
            
            {selectedVariant && (
              <div className="flex items-baseline gap-3 mt-4">
                <p className="text-4xl font-bold text-yametee-red">
                  {formatPrice(selectedVariant.price)}
                </p>
                <p className="text-gray-400 line-through text-xl">₱799</p>
                <span className="bg-yametee-red/20 text-yametee-red px-2 py-1 rounded text-sm font-semibold">
                  -25%
                </span>
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${stockStatus.bg} ${stockStatus.color}`}>
            <CheckIcon className="w-5 h-5" />
            <span className="font-semibold">{stockStatus.text}</span>
            {selectedVariant && selectedVariant.stockQuantity > 0 && (
              <span className="text-sm opacity-75">
                ({selectedVariant.stockQuantity} available)
              </span>
            )}
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              Color: <span className="text-gray-600 dark:text-gray-400 font-normal">{selectedColor || 'Select'}</span>
            </h3>
            <div className="flex gap-3 flex-wrap">
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
                    className={`px-6 py-3 rounded-lg font-medium transition-all border-2 ${
                      isSelected
                        ? 'bg-yametee-red text-white border-yametee-red shadow-lg shadow-yametee-red/50'
                        : hasStock
                        ? 'bg-gray-100 dark:bg-yametee-gray text-gray-900 dark:text-white border-gray-300 dark:border-yametee-lightGray hover:border-yametee-red/50 hover:bg-gray-200 dark:hover:bg-yametee-lightGray'
                        : hasVariant
                        ? 'bg-gray-100 dark:bg-yametee-gray text-gray-900 dark:text-white border-gray-300 dark:border-yametee-lightGray opacity-75 hover:opacity-100'
                        : 'bg-gray-50 dark:bg-yametee-dark text-gray-400 dark:text-gray-500 border-gray-200 dark:border-yametee-gray cursor-not-allowed opacity-50'
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              Size: <span className="text-gray-600 dark:text-gray-400 font-normal">{selectedSize || 'Select'}</span>
            </h3>
            <div className="flex gap-3 flex-wrap">
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
                    className={`w-14 h-14 rounded-lg font-semibold transition-all border-2 ${
                      isSelected
                        ? 'bg-yametee-red text-white border-yametee-red shadow-lg shadow-yametee-red/50'
                        : isAvailable
                        ? 'bg-gray-100 dark:bg-yametee-gray text-gray-900 dark:text-white border-gray-300 dark:border-yametee-lightGray hover:border-yametee-red/50 hover:bg-gray-200 dark:hover:bg-yametee-lightGray'
                        : 'bg-gray-50 dark:bg-yametee-dark text-gray-400 dark:text-gray-500 border-gray-200 dark:border-yametee-gray cursor-not-allowed opacity-50'
                    }`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
            <Link href="/size-guide" className="text-sm text-gray-600 dark:text-gray-400 hover:text-yametee-red mt-2 inline-block">
              Size Guide
            </Link>
          </div>

          {/* Quantity */}
          {selectedVariant && selectedVariant.stockQuantity > 0 && (
            <div>
              <label className="block text-gray-900 dark:text-white mb-2 font-semibold">Quantity</label>
              <div className="flex items-center gap-4 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 bg-gray-100 dark:bg-yametee-gray hover:bg-gray-200 dark:hover:bg-yametee-lightGray text-gray-900 dark:text-white rounded-lg font-bold transition-all border border-gray-300 dark:border-yametee-lightGray"
                >
                  −
                </button>
                <span className="text-gray-900 dark:text-white text-xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(selectedVariant.stockQuantity, quantity + 1))
                  }
                  className="w-12 h-12 bg-gray-100 dark:bg-yametee-gray hover:bg-gray-200 dark:hover:bg-yametee-lightGray text-gray-900 dark:text-white rounded-lg font-bold transition-all border border-gray-300 dark:border-yametee-lightGray"
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
              className="flex-1 bg-yametee-red text-white py-4 rounded-lg font-semibold text-lg hover:bg-yametee-red/90 transition-all disabled:bg-yametee-gray disabled:text-gray-500 disabled:cursor-not-allowed hover:scale-105 hover:shadow-lg hover:shadow-yametee-red/50 flex items-center justify-center gap-2"
            >
              <span>Add to Cart</span>
            </button>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center transition-all ${
                isWishlisted
                  ? 'bg-yametee-red border-yametee-red text-white'
                  : 'bg-gray-100 dark:bg-yametee-gray border-gray-300 dark:border-yametee-lightGray text-gray-900 dark:text-white hover:border-yametee-red'
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
              className="w-14 h-14 bg-gray-100 dark:bg-yametee-gray border-2 border-gray-300 dark:border-yametee-lightGray text-gray-900 dark:text-white rounded-lg flex items-center justify-center hover:border-yametee-red transition-all"
            >
              <ShareIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Product Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-yametee-lightGray">
            <div className="flex flex-col items-center text-center">
              <TruckIcon className="w-8 h-8 text-yametee-red mb-2" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Free Shipping</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Over ₱1,000</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <ShieldCheckIcon className="w-8 h-8 text-yametee-red mb-2" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Secure Payment</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">100% Protected</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <CheckIcon className="w-8 h-8 text-yametee-red mb-2" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Easy Returns</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">7 Days Return</p>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="pt-6 border-t border-gray-200 dark:border-yametee-lightGray">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Product Details</h3>
              <div
                className="text-gray-700 dark:text-gray-300 prose prose-invert dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}

          {/* Additional Info */}
          <div className="pt-6 border-t border-gray-200 dark:border-yametee-lightGray space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">SKU</span>
              <span className="text-gray-900 dark:text-white font-semibold">{selectedVariant?.sku || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Material</span>
              <span className="text-gray-900 dark:text-white font-semibold">100% Cotton</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Care Instructions</span>
              <span className="text-gray-900 dark:text-white font-semibold">Machine Wash Cold</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
