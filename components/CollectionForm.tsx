'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'

type ProductOption = {
  id: string
  name: string
  slug: string
  status: string
}

type CollectionProductEntry = {
  productId: string
  displayOrder: number
  featured: boolean
  product?: ProductOption
}

type ReleaseWindowInput = {
  id?: string
  startsAt: string
  endsAt: string
  status: 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'CLOSED' | 'CANCELLED'
  allowlistOnly: boolean
  password: string
  notes: string
  maxUnits: string
}

type StorySection = {
  title: string
  body: string
}

type CollectionFormState = {
  title: string
  slug: string
  subtitle: string
  description: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  heroImage: string
  launchDate: string
}

type CollectionFormProps = {
  products: ProductOption[]
  collection?: {
    id: string
    title: string
    slug: string
    subtitle: string | null
    description: string | null
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
    heroImage: string | null
    lookbookImages: string[]
    launchDate: string | null
    story?: {
      tagline?: string
      sections?: StorySection[]
    } | null
    products: CollectionProductEntry[]
    releaseWindows: (ReleaseWindowInput & {
      startsAt: string
      endsAt: string
    })[]
  }
}

const RELEASE_STATUS_OPTIONS: ReleaseWindowInput['status'][] = ['DRAFT', 'SCHEDULED', 'ACTIVE', 'CLOSED', 'CANCELLED']
const COLLECTION_STATUS_OPTIONS: CollectionFormState['status'][] = ['DRAFT', 'PUBLISHED', 'ARCHIVED']

const datetimeLocal = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

export default function CollectionForm({ products, collection }: CollectionFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CollectionFormState>({
    title: collection?.title || '',
    slug: collection?.slug || '',
    subtitle: collection?.subtitle || '',
    description: collection?.description || '',
    status: collection?.status || 'DRAFT',
    heroImage: collection?.heroImage || '',
    launchDate: datetimeLocal(collection?.launchDate),
  })
  const [lookbookImages, setLookbookImages] = useState<string[]>(collection?.lookbookImages || [])
  const [newLookbookUrl, setNewLookbookUrl] = useState('')
  const [storyTagline, setStoryTagline] = useState(collection?.story?.tagline || '')
  const [storySections, setStorySections] = useState<StorySection[]>(
    collection?.story?.sections || [{ title: '', body: '' }],
  )
  const [productEntries, setProductEntries] = useState<CollectionProductEntry[]>(
    collection?.products || [],
  )
  const [selectedProduct, setSelectedProduct] = useState('')
  const [releaseWindows, setReleaseWindows] = useState<ReleaseWindowInput[]>(
    collection?.releaseWindows?.map((window) => ({
      ...window,
      startsAt: datetimeLocal(window.startsAt),
      endsAt: datetimeLocal(window.endsAt),
      password: window.password || '',
      notes: window.notes || '',
      maxUnits: window.maxUnits || '',
    })) || [],
  )

  const availableProducts = useMemo(
    () => products.filter((product) => !productEntries.some((entry) => entry.productId === product.id)),
    [products, productEntries],
  )

  const handleAddLookbookImage = () => {
    if (!newLookbookUrl.trim()) return
    setLookbookImages((prev) => [...prev, newLookbookUrl.trim()])
    setNewLookbookUrl('')
  }

  const handleStorySectionChange = (index: number, field: keyof StorySection, value: string) => {
    setStorySections((prev) => prev.map((section, idx) => (idx === index ? { ...section, [field]: value } : section)))
  }

  const addStorySection = () => setStorySections((prev) => [...prev, { title: '', body: '' }])

  const removeStorySection = (index: number) =>
    setStorySections((prev) => prev.filter((_, idx) => idx !== index))

  const addProductEntry = () => {
    if (!selectedProduct) return
    setProductEntries((prev) => [
      ...prev,
      {
        productId: selectedProduct,
        displayOrder: prev.length + 1,
        featured: prev.length === 0,
      },
    ])
    setSelectedProduct('')
  }

  const updateProductEntry = (index: number, updates: Partial<CollectionProductEntry>) => {
    setProductEntries((prev) => prev.map((entry, idx) => (idx === index ? { ...entry, ...updates } : entry)))
  }

  const removeProductEntry = (index: number) => {
    setProductEntries((prev) => prev.filter((_, idx) => idx !== index))
  }

  const addReleaseWindow = () => {
    setReleaseWindows((prev) => [
      ...prev,
      {
        startsAt: '',
        endsAt: '',
        status: 'DRAFT',
        allowlistOnly: false,
        password: '',
        notes: '',
        maxUnits: '',
      },
    ])
  }

  const updateReleaseWindow = (index: number, updates: Partial<ReleaseWindowInput>) => {
    setReleaseWindows((prev) => prev.map((window, idx) => (idx === index ? { ...window, ...updates } : window)))
  }

  const removeReleaseWindow = (index: number) => {
    setReleaseWindows((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        lookbookImages: lookbookImages.filter(Boolean),
        launchDate: formData.launchDate ? new Date(formData.launchDate).toISOString() : null,
        story: {
          tagline: storyTagline || undefined,
          sections: storySections
            .filter((section) => section.title.trim() || section.body.trim())
            .map((section) => ({
              title: section.title.trim(),
              body: section.body.trim(),
            })),
        },
        products: productEntries.map((entry, index) => ({
          productId: entry.productId,
          displayOrder: Number(entry.displayOrder ?? index),
          featured: entry.featured,
        })),
        releaseWindows: releaseWindows
          .filter((window) => window.startsAt)
          .map((window) => ({
            startsAt: new Date(window.startsAt).toISOString(),
            endsAt: window.endsAt ? new Date(window.endsAt).toISOString() : null,
            status: window.status,
            allowlistOnly: window.allowlistOnly,
            password: window.password?.trim() || null,
            notes: window.notes?.trim() || null,
            maxUnits: window.maxUnits ? Number(window.maxUnits) : null,
          })),
      }

      if (!payload.slug) {
        payload.slug = slugify(payload.title)
      }

      const url = collection ? `/api/admin/collections/${collection.id}` : '/api/admin/collections'
      const method = collection ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save collection')
      }

      router.push('/admin/collections')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to save collection')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white dark:bg-yametee-gray border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Collection Basics</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-900 dark:text-white mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value,
                  slug: collection ? prev.slug : slugify(e.target.value),
                }))
              }
              className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
            />
          </div>
          <div>
            <label className="block text-gray-900 dark:text-white mb-2">Slug *</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
              className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-900 dark:text-white mb-2">Subtitle</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
              className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
            />
          </div>
          <div>
            <label className="block text-gray-900 dark:text-white mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value as CollectionFormState['status'] }))
              }
              className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
            >
              {COLLECTION_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-gray-900 dark:text-white mb-2">Launch Date</label>
          <input
            type="datetime-local"
            value={formData.launchDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, launchDate: e.target.value }))}
            className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
          />
        </div>
        <div>
          <label className="block text-gray-900 dark:text-white mb-2">Description</label>
          <textarea
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-yametee-gray border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Imagery</h2>
        <div>
          <label className="block text-gray-900 dark:text-white mb-2">Hero Image URL</label>
          <input
            type="text"
            value={formData.heroImage}
            onChange={(e) => setFormData((prev) => ({ ...prev, heroImage: e.target.value }))}
            placeholder="https://"
            className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
          />
        </div>
        <div>
          <label className="block text-gray-900 dark:text-white mb-2">Lookbook Images</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newLookbookUrl}
              placeholder="https://"
              onChange={(e) => setNewLookbookUrl(e.target.value)}
              className="flex-1 bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
            />
            <button
              type="button"
              onClick={handleAddLookbookImage}
              className="bg-gray-100 dark:bg-yametee-dark text-gray-900 dark:text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Add
            </button>
          </div>
          {lookbookImages.length > 0 && (
            <ul className="space-y-2">
              {lookbookImages.map((url, index) => (
                <li key={url + index} className="flex items-center justify-between bg-gray-50 dark:bg-yametee-dark px-4 py-2 rounded-lg">
                  <span className="text-sm text-gray-900 dark:text-white truncate">{url}</span>
                  <button
                    type="button"
                    onClick={() => setLookbookImages((prev) => prev.filter((_, idx) => idx !== index))}
                    className="text-yametee-red text-sm font-semibold hover:text-yametee-red/80"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-yametee-gray border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Storytelling</h2>
        <div>
          <label className="block text-gray-900 dark:text-white mb-2">Tagline</label>
          <input
            type="text"
            value={storyTagline}
            onChange={(e) => setStoryTagline(e.target.value)}
            className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
          />
        </div>
        <div className="space-y-4">
          {storySections.map((section, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900 dark:text-white font-semibold">Section {index + 1}</h3>
                {storySections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStorySection(index)}
                    className="text-yametee-red text-sm font-semibold"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="Title"
                value={section.title}
                onChange={(e) => handleStorySectionChange(index, 'title', e.target.value)}
                className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
              />
              <textarea
                rows={3}
                placeholder="Body"
                value={section.body}
                onChange={(e) => handleStorySectionChange(index, 'body', e.target.value)}
                className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addStorySection}
          className="bg-gray-100 dark:bg-yametee-dark text-gray-900 dark:text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Add Story Section
        </button>
      </div>

      <div className="bg-white dark:bg-yametee-gray border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Products in Drop</h2>
          <div className="flex gap-2">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
            >
              <option value="">Select product</option>
              {availableProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addProductEntry}
              disabled={!selectedProduct}
              className="bg-yametee-red text-white px-4 py-2 rounded-lg font-semibold hover:bg-yametee-red/90 transition disabled:bg-gray-300 disabled:text-gray-500"
            >
              Add Product
            </button>
          </div>
        </div>
        {productEntries.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No products selected yet.</p>
        ) : (
          <div className="space-y-3">
            {productEntries.map((entry, index) => {
              const product = products.find((p) => p.id === entry.productId)
              return (
                <div
                  key={entry.productId}
                  className="flex flex-col md:flex-row md:items-center gap-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white font-semibold">{product?.name || 'Unknown product'}</p>
                    <p className="text-sm text-gray-500">{product?.slug}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Order</label>
                      <input
                        type="number"
                        value={entry.displayOrder}
                        onChange={(e) => updateProductEntry(index, { displayOrder: parseInt(e.target.value) || 0 })}
                        className="w-24 bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-6 md:mt-0">
                      <input
                        type="checkbox"
                        checked={entry.featured}
                        onChange={(e) => updateProductEntry(index, { featured: e.target.checked })}
                        className="w-5 h-5 text-yametee-red focus:ring-yametee-red border-gray-300 rounded"
                      />
                      <span className="text-gray-900 dark:text-white text-sm font-medium">Featured</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProductEntry(index)}
                      className="text-yametee-red font-semibold hover:text-yametee-red/80"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-yametee-gray border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Release Windows</h2>
          <button
            type="button"
            onClick={addReleaseWindow}
            className="bg-gray-100 dark:bg-yametee-dark text-gray-900 dark:text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Add Window
          </button>
        </div>
        {releaseWindows.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No release schedule configured.</p>
        ) : (
          <div className="space-y-4">
            {releaseWindows.map((window, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-900 dark:text-white font-semibold">Window {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeReleaseWindow(index)}
                    className="text-yametee-red text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-900 dark:text-white mb-1">Start *</label>
                    <input
                      type="datetime-local"
                      required
                      value={window.startsAt}
                      onChange={(e) => updateReleaseWindow(index, { startsAt: e.target.value })}
                      className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-900 dark:text-white mb-1">End</label>
                    <input
                      type="datetime-local"
                      value={window.endsAt}
                      onChange={(e) => updateReleaseWindow(index, { endsAt: e.target.value })}
                      className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-900 dark:text-white mb-1">Status</label>
                    <select
                      value={window.status}
                      onChange={(e) =>
                        updateReleaseWindow(index, { status: e.target.value as ReleaseWindowInput['status'] })
                      }
                      className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
                    >
                      {RELEASE_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 mt-6 md:mt-8">
                    <input
                      type="checkbox"
                      checked={window.allowlistOnly}
                      onChange={(e) => updateReleaseWindow(index, { allowlistOnly: e.target.checked })}
                      className="w-5 h-5 text-yametee-red focus:ring-yametee-red border-gray-300 rounded"
                    />
                    <span className="text-gray-900 dark:text-white text-sm font-medium">Allowlist only</span>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-900 dark:text-white mb-1">Access Password</label>
                    <input
                      type="text"
                      value={window.password}
                      onChange={(e) => updateReleaseWindow(index, { password: e.target.value })}
                      className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-900 dark:text-white mb-1">Max Units</label>
                    <input
                      type="number"
                      value={window.maxUnits}
                      onChange={(e) => updateReleaseWindow(index, { maxUnits: e.target.value })}
                      className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-900 dark:text-white mb-1">Notes</label>
                  <textarea
                    rows={2}
                    value={window.notes}
                    onChange={(e) => updateReleaseWindow(index, { notes: e.target.value })}
                    className="w-full bg-white dark:bg-yametee-dark border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yametee-red"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-yametee-red">{error}</p>}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="bg-yametee-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-yametee-red/90 transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving...' : collection ? 'Update Collection' : 'Create Collection'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/collections')}
          className="bg-gray-100 dark:bg-yametee-dark text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
