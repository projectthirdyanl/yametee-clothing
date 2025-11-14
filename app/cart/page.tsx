'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { formatPrice } from '@/lib/utils'

interface CartItem {
  productId: string
  variantId: string
  size: string
  color: string
  quantity: number
  price: number
  productName: string
  imageUrl: string
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCart = () => {
      const cartData = localStorage.getItem('cart')
      if (cartData) {
        setCart(JSON.parse(cartData))
      }
      setLoading(false)
    }

    loadCart()
    window.addEventListener('cartUpdated', loadCart)
    return () => window.removeEventListener('cartUpdated', loadCart)
  }, [])

  const updateQuantity = (variantId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(variantId)
      return
    }

    const updatedCart = cart.map((item) =>
      item.variantId === variantId ? { ...item, quantity: newQuantity } : item
    )
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const removeItem = (variantId: string) => {
    const updatedCart = cart.filter((item) => item.variantId !== variantId)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + parseFloat(item.price.toString()) * item.quantity,
    0
  )
  const shippingFee = subtotal > 0 ? 100 : 0
  const grandTotal = subtotal + shippingFee

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-900 dark:text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Shopping Cart</h1>

          {cart.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 dark:text-gray-400 text-xl mb-6">Your cart is empty.</p>
              <Link
                href="/products"
                className="inline-block bg-yametee-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-yametee-red/90 transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.variantId}
                    className="bg-white dark:bg-yametee-gray border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex gap-4"
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {item.productName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {item.size} · {item.color}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            -
                          </button>
                          <span className="text-gray-900 dark:text-white w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-yametee-red font-semibold">
                            {formatPrice(parseFloat(item.price.toString()) * item.quantity)}
                          </p>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="text-gray-600 dark:text-gray-400 hover:text-yametee-red transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-yametee-gray border border-gray-200 dark:border-gray-700 rounded-lg p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>Shipping</span>
                      <span>{formatPrice(shippingFee)}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                      <div className="flex justify-between text-gray-900 dark:text-white font-bold text-lg">
                        <span>Total</span>
                        <span className="text-yametee-red">{formatPrice(grandTotal)}</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/checkout"
                    className="block w-full bg-yametee-red text-white py-3 rounded-lg font-semibold text-center hover:bg-yametee-red/90 transition-all hover:scale-105"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
