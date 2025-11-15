import AdminLayout from '@/components/AdminLayout'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getOrders(status?: string) {
  try {
    const where: any = {}
    if (status && status !== 'ALL') {
      where.status = status
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
            variant: {
              select: {
                size: true,
                color: true,
              },
            },
          },
        },
      },
    })

    return orders
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount)
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const orders = await getOrders(searchParams?.status)

  const filterConfig = [
    'ALL',
    'PENDING',
    'PAID',
    'PROCESSING',
    'SHIPPED',
    'COMPLETED',
    'CANCELLED',
  ]

  const statusCounts = filterConfig.reduce<Record<string, number>>((acc, status) => {
    if (status === 'ALL') {
      acc.ALL = orders.length
      return acc
    }
    acc[status] = orders.filter((o) => o.status === status).length
    return acc
  }, {})

  const currentStatus = searchParams?.status || 'ALL'

  const statusStyles: Record<string, { badge: string; label: string }> = {
    COMPLETED: { badge: 'border-green-400/40 bg-green-400/10 text-green-200', label: 'Completed' },
    PENDING: { badge: 'border-amber-400/40 bg-amber-400/10 text-amber-100', label: 'Pending' },
    PROCESSING: { badge: 'border-blue-300/40 bg-blue-300/10 text-blue-100', label: 'Processing' },
    SHIPPED: { badge: 'border-purple-300/40 bg-purple-300/10 text-purple-100', label: 'Shipped' },
    PAID: { badge: 'border-lime-300/40 bg-lime-300/10 text-lime-100', label: 'Paid' },
    CANCELLED: { badge: 'border-red-400/40 bg-red-400/10 text-red-200', label: 'Cancelled' },
  }

  return (
    <AdminLayout>
      <div className="space-y-8 text-white">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Orders Monitor</p>
            <h1 className="font-display text-4xl tracking-[0.2em]">Fulfillment Queue</h1>
          </div>
          <Link
            href="/admin/orders?status=PENDING"
            className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.4em] text-white/70 transition hover:border-street-lime/40 hover:text-street-lime"
          >
            Jump to pending
          </Link>
        </div>

        <div className="flex flex-wrap gap-3">
          {filterConfig.map((status) => (
            <Link
              key={status}
              href={`/admin/orders${status === 'ALL' ? '' : `?status=${status}`}`}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] transition ${
                currentStatus === status
                  ? 'border-street-lime/50 bg-street-lime/10 text-street-lime shadow-neon'
                  : 'border-white/10 bg-white/0 text-white/60 hover:border-white/30 hover:text-white'
              }`}
            >
              {status} • {statusCounts[status] ?? 0}
            </Link>
          ))}
        </div>

        <div className="rounded-3xl border border-white/10 bg-street-carbon/60 p-1">
          <div className="rounded-[28px] border border-white/5 bg-black/30 px-2 py-4">
            {orders.length === 0 ? (
              <div className="py-20 text-center text-white/60">No orders found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-[0.35em] text-white/40">
                      <th className="border-b border-white/5 py-3 pr-4">Order</th>
                      <th className="border-b border-white/5 py-3 pr-4">Customer</th>
                      <th className="border-b border-white/5 py-3 pr-4">Items</th>
                      <th className="border-b border-white/5 py-3 pr-4">Total</th>
                      <th className="border-b border-white/5 py-3 pr-4">Payment</th>
                      <th className="border-b border-white/5 py-3 pr-4">Status</th>
                      <th className="border-b border-white/5 py-3 pr-4">Date</th>
                      <th className="border-b border-white/5 py-3 pr-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const tone = statusStyles[order.status] || statusStyles.PENDING
                      const paymentTone =
                        order.paymentStatus === 'PAID'
                          ? 'border-lime-300/40 bg-lime-300/10 text-lime-100'
                          : order.paymentStatus === 'PENDING'
                          ? 'border-amber-400/40 bg-amber-400/10 text-amber-100'
                          : 'border-red-400/40 bg-red-400/10 text-red-200'

                      return (
                        <tr
                          key={order.id}
                          className="border-b border-white/5 text-white/80 transition hover:bg-white/5"
                        >
                          <td className="py-4 pr-4">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="font-semibold text-street-lime hover:underline"
                            >
                              {order.orderNumber}
                            </Link>
                          </td>
                          <td className="py-4 pr-4">
                            <div className="font-medium text-white">
                              {order.customer?.name || 'Guest'}
                            </div>
                            {order.customer?.email && (
                              <div className="text-xs text-white/50">{order.customer.email}</div>
                            )}
                          </td>
                          <td className="py-4 pr-4">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </td>
                          <td className="py-4 pr-4 font-semibold text-white">
                            {formatCurrency(Number(order.grandTotal))}
                          </td>
                          <td className="py-4 pr-4">
                            <span
                              className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.3em] ${paymentTone}`}
                            >
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            <span
                              className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.3em] ${tone.badge}`}
                            >
                              {tone.label}
                            </span>
                          </td>
                          <td className="py-4 pr-4 text-xs text-white/60">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 pr-4">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70 transition hover:border-street-lime/40 hover:text-street-lime"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
