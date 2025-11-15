'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Variant {
  id: string
  stockQuantity: number
}

export default function UpdateStockForm({ variant }: { variant: Variant }) {
  const router = useRouter()
  const [stock, setStock] = useState(variant.stockQuantity.toString())
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    const newStock = parseInt(stock)
    if (isNaN(newStock) || newStock < 0) {
      alert('Please enter a valid stock quantity')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/products/variants/${variant.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockQuantity: newStock }),
      })

      if (!response.ok) {
        throw new Error('Failed to update stock')
      }

      router.refresh()
    } catch (error) {
      alert('Failed to update stock')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        min="0"
        className="w-20 bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
      />
      <button
        onClick={handleUpdate}
        disabled={loading || stock === variant.stockQuantity.toString()}
        className="px-3 py-1 bg-yametee-red text-white text-sm rounded hover:bg-yametee-red/90 transition-all disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
      >
        {loading ? '...' : 'Update'}
      </button>
    </div>
  )
}
