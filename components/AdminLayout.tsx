'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: '▣' },
  { name: 'Orders', href: '/admin/orders', icon: '◎' },
  { name: 'Products', href: '/admin/products', icon: '◇' },
  { name: 'Customers', href: '/admin/customers', icon: '△' },
  { name: 'Inventory', href: '/admin/inventory', icon: '▤' },
]

const statusTape = [
  'Drop 07 Fulfillment',
  'PayMongo Connected',
  'Low Stock Monitor Active',
  'Overnight Shipping Beta',
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem('adminToken')
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
    const savedSidebarState = localStorage.getItem('adminSidebarOpen')
    if (savedSidebarState !== null) {
      setSidebarOpen(savedSidebarState === 'true')
    }
  }, [router, pathname])

  const toggleSidebar = () => {
    const newState = !sidebarOpen
    setSidebarOpen(newState)
    localStorage.setItem('adminSidebarOpen', String(newState))
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-street-carbon text-white">
        <p className="tracking-[0.4em] text-white/60">LOADING</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-street-ink text-white">
        <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-yametee-red/25 blur-[180px]" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-street-lime/15 blur-[180px]" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40H180' stroke='white' stroke-opacity='0.05'/%3E%3Cpath d='M0 80H180' stroke='white' stroke-opacity='0.05'/%3E%3Cpath d='M40 0V180' stroke='white' stroke-opacity='0.05'/%3E%3Cpath d='M80 0V180' stroke='white' stroke-opacity='0.05'/%3E%3C/svg%3E\")",
            }}
          />
      </div>

      <header className="relative border-b border-white/10 bg-street-carbon/70 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="rounded-2xl border border-white/15 bg-white/5 p-3 text-white transition hover:border-street-lime/40"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            <Link href="/admin" className="font-display text-2xl tracking-[0.2em] text-white">
              YAMETEE OPS
            </Link>
            <span className="hidden rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60 md:inline-flex">
              Manila Control Room
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em]">
            <Link
              href="/"
              className="rounded-full border border-white/15 px-4 py-2 text-white/70 transition hover:border-street-lime/40 hover:text-white"
            >
              View Store
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('adminToken')
                router.push('/admin/login')
              }}
              className="rounded-full border border-white/15 px-4 py-2 text-white/60 transition hover:border-yametee-red/40 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="marquee border-t border-white/10 bg-black/30 text-[10px] uppercase tracking-[0.6em] text-white/60">
          <div className="marquee-track">
            {statusTape.map((item) => (
              <span key={item}>{item}</span>
            ))}
            {statusTape.map((item) => (
              <span key={`${item}-ghost`}>{item}</span>
            ))}
          </div>
        </div>
      </header>

      <div className="relative flex">
        <aside
          className={`border-r border-white/10 bg-street-carbon/40 backdrop-blur-xl transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
          }`}
        >
          <nav className={`space-y-2 px-4 py-6 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === '/admin' && pathname === '/admin') ||
                (item.href !== '/admin' && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition ${
                    isActive
                      ? 'border-street-lime/40 bg-street-lime/10 text-street-lime shadow-neon'
                      : 'border-white/5 bg-white/0 text-white/70 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className="relative flex-1 px-4 py-10">
          <div className="container mx-auto">
            <div className="rounded-[32px] border border-white/10 bg-street-carbon/60 p-1">
              <div className="rounded-[28px] border border-white/5 bg-black/40 p-6 shadow-brand">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
