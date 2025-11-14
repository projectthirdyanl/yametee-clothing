import AdminLayout from '@/components/AdminLayout'
import { prisma } from '@/lib/prisma'

async function getStats() {
  try {
    const totalSales = await prisma.order.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { grandTotal: true },
    })

    const totalOrders = await prisma.order.count()
    const pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todaySales = await prisma.order.aggregate({
      where: { status: 'COMPLETED', createdAt: { gte: today } },
      _sum: { grandTotal: true },
    })

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    const monthSales = await prisma.order.aggregate({
      where: { status: 'COMPLETED', createdAt: { gte: startOfMonth } },
      _sum: { grandTotal: true },
    })

    const totalCustomers = await prisma.customer.count()
    const lowStockProducts = await prisma.variant.count({
      where: { stockQuantity: { lt: 10 } },
    })

    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { name: true, email: true } },
        items: {
          include: {
            product: { select: { name: true } },
            variant: { select: { size: true, color: true } },
          },
        },
      },
    })

    return {
      totalSales: Number(totalSales._sum.grandTotal || 0),
      totalOrders,
      pendingOrders,
      todaySales: Number(todaySales._sum.grandTotal || 0),
      monthSales: Number(monthSales._sum.grandTotal || 0),
      totalCustomers,
      lowStockProducts,
      recentOrders,
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      totalSales: 0,
      totalOrders: 0,
      pendingOrders: 0,
      todaySales: 0,
      monthSales: 0,
      totalCustomers: 0,
      lowStockProducts: 0,
      recentOrders: [],
    }
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount)
}

export default async function AdminDashboard() {
  const stats = await getStats()
  const primaryStats = [
    {
      label: 'Gross Sales',
      value: formatCurrency(stats.totalSales),
      meta: 'Launch to date',
      tag: '+8% MoM',
    },
    {
      label: 'Orders Logged',
      value: stats.totalOrders.toString(),
      meta: 'All statuses',
      tag: `${stats.pendingOrders} pending`,
    },
    {
      label: 'Today Revenue',
      value: formatCurrency(stats.todaySales),
      meta: 'Since midnight',
      tag: 'Live sync',
    },
    {
      label: 'Active Customers',
      value: stats.totalCustomers.toString(),
      meta: 'Unique purchasers',
      tag: 'Community',
    },
  ]

  const secondaryStats = [
    {
      label: 'Month To Date',
      value: formatCurrency(stats.monthSales),
      meta: 'Reset every 1st',
    },
    {
      label: 'Low Stock SKUs',
      value: stats.lowStockProducts.toString(),
      meta: '< 10 pcs per variant',
    },
    {
      label: 'Fulfillment Queue',
      value: `${stats.pendingOrders} orders`,
      meta: 'Needs action',
    },
  ]

  const statusStyles: Record<
    string,
    { badge: string; chip: string; label: string }
  > = {
    COMPLETED: {
      label: 'Completed',
      badge: 'border border-green-400/40 bg-green-400/10 text-green-200',
      chip: 'bg-green-400/15 text-green-200',
    },
    PENDING: {
      label: 'Pending',
      badge: 'border border-amber-400/40 bg-amber-400/10 text-amber-200',
      chip: 'bg-amber-400/15 text-amber-200',
    },
    PROCESSING: {
      label: 'Processing',
      badge: 'border border-blue-300/40 bg-blue-300/10 text-blue-100',
      chip: 'bg-blue-300/15 text-blue-100',
    },
    SHIPPED: {
      label: 'Shipped',
      badge: 'border border-purple-300/40 bg-purple-300/10 text-purple-100',
      chip: 'bg-purple-300/15 text-purple-100',
    },
    CANCELLED: {
      label: 'Cancelled',
      badge: 'border border-red-400/40 bg-red-400/10 text-red-200',
      chip: 'bg-red-400/15 text-red-200',
    },
  }

  return (
    <AdminLayout>
      <div className="space-y-10 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Drop 07 Control</p>
            <h1 className="font-display text-4xl tracking-[0.2em]">Operations Dashboard</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="stat-pill text-xs text-white/70">PayMongo · Live</span>
            <span className="stat-pill text-xs text-white/70">Inventory Sync · Enabled</span>
            <span className="stat-pill text-xs text-white/70">Auto Alerts · Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {primaryStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-black/30 p-5"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold text-street-lime">{stat.value}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-white/50">
                <span>{stat.meta}</span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-white/70">
                  {stat.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {secondaryStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-street-carbon/70 p-5 shadow-inner"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">{stat.label}</p>
              <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
              <p className="mt-1 text-xs text-white/50">{stat.meta}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-street-carbon/70 p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Recent Orders</p>
              <h2 className="text-2xl font-semibold">Latest traffic from Yametee.com</h2>
            </div>
            <a
              href="/admin/orders"
              className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.4em] text-white/70 transition hover:border-street-lime/40 hover:text-street-lime"
            >
              View all
            </a>
          </div>
          {stats.recentOrders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 py-10 text-center text-white/60">
              No orders yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.35em] text-white/50">
                    <th className="border-b border-white/10 py-3 pr-4">Order</th>
                    <th className="border-b border-white/10 py-3 pr-4">Customer</th>
                    <th className="border-b border-white/10 py-3 pr-4">Items</th>
                    <th className="border-b border-white/10 py-3 pr-4">Total</th>
                    <th className="border-b border-white/10 py-3 pr-4">Status</th>
                    <th className="border-b border-white/10 py-3 pr-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => {
                    const tone = statusStyles[order.status] || statusStyles.PENDING
                    return (
                      <tr
                        key={order.id}
                        className="border-b border-white/5 text-white/80 transition hover:bg-white/5"
                      >
                        <td className="py-4 pr-4">
                          <a
                            href={`/admin/orders/${order.id}`}
                            className="font-semibold text-street-lime hover:underline"
                          >
                            {order.orderNumber}
                          </a>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="font-medium text-white">
                            {order.customer?.name || 'Guest'}
                          </div>
                          <div className="text-xs text-white/50">
                            {order.customer?.email || 'No email'}
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </td>
                        <td className="py-4 pr-4 font-semibold text-white">
                          {formatCurrency(Number(order.grandTotal))}
                        </td>
                        <td className="py-4 pr-4">
                          <span className={`rounded-full px-3 py-1 text-xs uppercase ${tone.badge}`}>
                            {tone.label}
                          </span>
                        </td>
                        <td className="py-4 pr-4 text-xs text-white/60">
                          {new Date(order.createdAt).toLocaleDateString()}
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
    </AdminLayout>
  )
}
