'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Order {
  id: string
  status: string
  paymentStatus: string
}

export default function OrderStatusUpdate({ order }: { order: Order }) {
  const router = useRouter()
  const [status, setStatus] = useState(order.status)
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus)
  const [loading, setLoading] = useState(false)

  const handleStatusUpdate = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update order')
      }

      router.refresh()
    } catch (error) {
      alert('Failed to update order status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-yametee-gray border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Update Order Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Order Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
          >
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Payment Status
          </label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
          >
            <option value="UNPAID">UNPAID</option>
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="REFUNDED">REFUNDED</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>
      </div>
      <button
        onClick={handleStatusUpdate}
        disabled={loading}
        className="mt-4 bg-yametee-red text-white px-6 py-2 rounded-lg font-semibold hover:bg-yametee-red/90 transition-all disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
      >
        {loading ? 'Updating...' : 'Update Status'}
      </button>
    </div>
  )
}
