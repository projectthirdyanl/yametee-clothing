import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { prisma } from '@/lib/prisma'

async function getPromotions() {
  try {
    return await prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        collection: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })
  } catch (error) {
    console.error('Error fetching promotions:', error)
    return []
  }
}

const formatDate = (value?: Date | null) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function AdminPromotionsPage() {
  const promotions = await getPromotions()

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Promotions</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage incentives, bundles, and launch perks.</p>
        </div>
        <Link
          href="/admin/promotions/new"
          className="bg-yametee-red text-white px-6 py-2 rounded-lg font-semibold hover:bg-yametee-red/90 transition"
        >
          New Promotion
        </Link>
      </div>

      {promotions.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-yametee-gray border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">No promotions yet.</p>
          <Link
            href="/admin/promotions/new"
            className="inline-block bg-yametee-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-yametee-red/90 transition"
          >
            Create your first promo
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-yametee-gray border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-yametee-dark border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="p-4 text-left text-gray-900 dark:text-white font-semibold">Promotion</th>
                <th className="p-4 text-left text-gray-900 dark:text-white font-semibold">Type</th>
                <th className="p-4 text-left text-gray-900 dark:text-white font-semibold">Status</th>
                <th className="p-4 text-left text-gray-900 dark:text-white font-semibold">Collection</th>
                <th className="p-4 text-left text-gray-900 dark:text-white font-semibold">Schedule</th>
                <th className="p-4 text-left text-gray-900 dark:text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promotion) => (
                <tr
                  key={promotion.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-yametee-dark/50 transition"
                >
                  <td className="p-4">
                    <div>
                      <p className="text-gray-900 dark:text-white font-semibold">{promotion.name}</p>
                      <p className="text-sm text-gray-500">{promotion.code || 'Automatic'}</p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-900 dark:text-white">{promotion.type.replace('_', ' ')}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        promotion.status === 'ACTIVE'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : promotion.status === 'DRAFT'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {promotion.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-900 dark:text-white">
                    {promotion.collection?.title || 'Global'}
                  </td>
                  <td className="p-4 text-gray-900 dark:text-white">
                    <div className="space-y-1">
                      <p className="text-sm">
                        {formatDate(promotion.startsAt as Date)} → {formatDate(promotion.endsAt as Date)}
                      </p>
                      <p className="text-xs text-gray-500">{promotion.channels.join(', ') || 'All channels'}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/admin/promotions/${promotion.id}`}
                      className="text-yametee-red font-semibold hover:text-yametee-red/80"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
