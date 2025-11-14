'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type CollectionOption = {
  id: string
  title: string
  slug: string
}

type PromotionEntity = {
  id: string
  name: string
  code: string | null
  description: string | null
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING' | 'BUNDLE' | 'GIFT'
  status: 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'ARCHIVED'
  value: string
  stackable: boolean
  usageLimit: number | null
  startsAt: string | null
  endsAt: string | null
  channels: string[]
  collectionId: string | null
  minSubtotal?: string
  customerTier?: string
  firstPurchaseOnly?: boolean
}

type PromotionFormProps = {
  collections: CollectionOption[]
  promotion?: PromotionEntity
}

const PROMOTION_TYPES: PromotionEntity['type'][] = [
  'PERCENTAGE',
  'FIXED_AMOUNT',
  'FREE_SHIPPING',
  'BUNDLE',
  'GIFT',
]

const PROMOTION_STATUSES: PromotionEntity['status'][] = [
  'DRAFT',
  'SCHEDULED',
  'ACTIVE',
  'PAUSED',
  'EXPIRED',
  'ARCHIVED',
]

const CUSTOMER_TIERS = ['', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'BLACK']

const datetimeLocal = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

export default function PromotionForm({ collections, promotion }: PromotionFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: promotion?.name || '',
    code: promotion?.code || '',
    description: promotion?.description || '',
    type: promotion?.type || 'PERCENTAGE',
    status: promotion?.status || 'DRAFT',
    value: promotion?.value || '',
    stackable: promotion?.stackable ?? false,
    usageLimit: promotion?.usageLimit?.toString() || '',
    startsAt: datetimeLocal(promotion?.startsAt),
    endsAt: datetimeLocal(promotion?.endsAt),
    collectionId: promotion?.collectionId || '',
    minSubtotal: promotion?.minSubtotal || '',
    customerTier: promotion?.customerTier || '',
    firstPurchaseOnly: promotion?.firstPurchaseOnly ?? false,
  })
  const [channels, setChannels] = useState<string[]>(promotion?.channels || [])
  const [channelInput, setChannelInput] = useState('')

  const addChannel = () => {
    if (!channelInput.trim()) return
    setChannels((prev) => [...prev, channelInput.trim()])
    setChannelInput('')
  }

  const removeChannel = (index: number) => {
    setChannels((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        value: parseFloat(formData.value),
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        startsAt: formData.startsAt ? new Date(formData.startsAt).toISOString() : null,
        endsAt: formData.endsAt ? new Date(formData.endsAt).toISOString() : null,
        channels,
        minSubtotal: formData.minSubtotal ? parseFloat(formData.minSubtotal) : null,
        customerTier: formData.customerTier || null,
        firstPurchaseOnly: formData.firstPurchaseOnly,
      }

      const url = promotion ? `/api/admin/promotions/${promotion.id}` : '/api/admin/promotions'
      const method = promotion ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save promotion')
      }

      router.push('/admin/promotions')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to save promotion')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white dark:bg-yametee-gray border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Promotion Details</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-900 dark:text-white mb-2">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
            />
          </div>
          <div>
            <label className="block text-gray-900 dark:text-white mb-2">Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
              placeholder="Optional (leave blank for automatic)"
              className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-900 dark:text-white mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, type: e.target.value as PromotionEntity['type'] }))
              }
              className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
            >
              {PROMOTION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-900 dark:text-white mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as PromotionEntity['status'],
                  }))
              }
              className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
            >
              {PROMOTION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-900 dark:text-white mb-2">Value *</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.value}
              onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
              className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter percentage (e.g. 15) or peso value depending on type.
            </p>
          </div>
          <div>
            <label className="block text-gray-900 dark:text-white mb-2">Usage Limit</label>
            <input
              type="number"
              value={formData.usageLimit}
              onChange={(e) => setFormData((prev) => ({ ...prev, usageLimit: e.target.value }))}
              placeholder="Leave blank for unlimited"
              className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-900 dark:text-white mb-2">Description</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.stackable}
            onChange={(e) => setFormData((prev) => ({ ...prev, stackable: e.target.checked }))}
            className="w-5 h-5 text-yametee-red focus:ring-yametee-red border-gray-300 rounded"
          />
          <span className="text-gray-900 dark:text-white text-sm font-medium">Stackable with other promos</span>
        </div>
      </div>

      <div className="bg-white dark:bg-yametee-gray border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Scheduling & Targeting</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-900 dark:text-white mb-2">Start Time</label>
            <input
              type="datetime-local"
              value={formData.startsAt}
              onChange={(e) => setFormData((prev) => ({ ...prev, startsAt: e.target.value }))}
              className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
            />
          </div>
          <div>
            <label className="block text-gray-900 dark:text-white mb-2">End Time</label>
            <input
              type="datetime-local"
              value={formData.endsAt}
              onChange={(e) => setFormData((prev) => ({ ...prev, endsAt: e.target.value }))}
              className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-900 dark:text-white mb-2">Applies to Collection</label>
          <select
            value={formData.collectionId}
            onChange={(e) => setFormData((prev) => ({ ...prev, collectionId: e.target.value }))}
            className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
          >
            <option value="">All products</option>
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.title}
              </option>
            ))}
          </select>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-900 dark:text-white mb-2">Minimum Subtotal (₱)</label>
            <input
              type="number"
              value={formData.minSubtotal}
              onChange={(e) => setFormData((prev) => ({ ...prev, minSubtotal: e.target.value }))}
              placeholder="Optional"
              className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
            />
          </div>
          <div>
            <label className="block text-gray-900 dark:text-white mb-2">Customer Tier</label>
            <select
              value={formData.customerTier}
              onChange={(e) => setFormData((prev) => ({ ...prev, customerTier: e.target.value }))}
              className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
            >
              {CUSTOMER_TIERS.map((tier) => (
                <option key={tier || 'any'} value={tier}>
                  {tier ? tier.toLowerCase() : 'Any tier'}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 mt-6 md:mt-8">
            <input
              type="checkbox"
              checked={formData.firstPurchaseOnly}
              onChange={(e) => setFormData((prev) => ({ ...prev, firstPurchaseOnly: e.target.checked }))}
              className="w-5 h-5 text-yametee-red focus:ring-yametee-red border-gray-300 rounded"
            />
            <span className="text-gray-900 dark:text-white text-sm font-medium">First purchase only</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-yametee-gray border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Channels</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. email, tiktok, sms"
            value={channelInput}
            onChange={(e) => setChannelInput(e.target.value)}
            className="flex-1 bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
          />
          <button
            type="button"
            onClick={addChannel}
            className="bg-gray-100 dark:bg-yametee-dark text-gray-900 dark:text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Add Channel
          </button>
        </div>
        {channels.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {channels.map((channel, index) => (
              <span
                key={channel + index}
                className="inline-flex items-center gap-2 bg-gray-100 dark:bg-yametee-dark text-gray-900 dark:text-white px-4 py-2 rounded-full text-sm"
              >
                {channel}
                <button
                  type="button"
                  onClick={() => removeChannel(index)}
                  className="text-yametee-red font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-yametee-red">{error}</p>}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="bg-yametee-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-yametee-red/90 transition disabled:bg-gray-300 disabled:text-gray-500"
        >
          {submitting ? 'Saving...' : promotion ? 'Update Promotion' : 'Create Promotion'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/promotions')}
          className="bg-gray-100 dark:bg-yametee-dark text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
