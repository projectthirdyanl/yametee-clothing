import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { prisma } from '@/lib/prisma'

async function getCollections() {
  try {
    return await prisma.collection.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        products: true,
        releaseWindows: {
          orderBy: { startsAt: 'asc' },
        },
      },
    })
  } catch (error) {
    console.error('Error fetching collections:', error)
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

export default async function AdminCollectionsPage() {
  const collections = await getCollections()

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Collections</h1>
          <p className="text-gray-600 dark:text-gray-400">Curate and schedule your streetwear drops.</p>
        </div>
        <Link
          href="/admin/collections/new"
          className="bg-yametee-red text-white px-6 py-2 rounded-lg font-semibold hover:bg-yametee-red/90 transition"
        >
          New Collection
        </Link>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-yametee-gray border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">No collections yet.</p>
          <Link
            href="/admin/collections/new"
            className="inline-block bg-yametee-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-yametee-red/90 transition"
          >
            Create your first drop
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-yametee-gray border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-yametee-dark border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="p-4 text-left text-gray-900 dark:text-white font-semibold">Collection</th>
                <th className="p-4 text-left text-gray-900 dark:text-white font-semibold">Status</th>
                <th className="p-4 text-left text-gray-900 dark:text-white font-semibold">Pieces</th>
                <th className="p-4 text-left text-gray-900 dark:text-white font-semibold">Next Release</th>
                <th className="p-4 text-left text-gray-900 dark:text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((collection) => {
                const nextWindow = collection.releaseWindows[0]
                return (
                  <tr
                    key={collection.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-yametee-dark/50 transition"
                  >
                    <td className="p-4">
                      <div>
                        <p className="text-gray-900 dark:text-white font-semibold">{collection.title}</p>
                        <p className="text-sm text-gray-500">{collection.slug}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          collection.status === 'PUBLISHED'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : collection.status === 'DRAFT'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {collection.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-900 dark:text-white">{collection.products.length}</td>
                    <td className="p-4 text-gray-900 dark:text-white">
                      {nextWindow ? (
                        <div className="space-y-1">
                          <p className="font-semibold">{formatDate(nextWindow.startsAt)}</p>
                          <p className="text-sm text-gray-500">{nextWindow.status}</p>
                        </div>
                      ) : (
                        <span className="text-gray-500">No window</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/admin/collections/${collection.id}`}
                          className="text-yametee-red font-semibold hover:text-yametee-red/80"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/collections/${collection.slug}`}
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
