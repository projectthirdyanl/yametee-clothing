'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Orders', href: '/admin/orders', icon: '📦' },
  { name: 'Products', href: '/admin/products', icon: '👕' },
  { name: 'Collections', href: '/admin/collections', icon: '🎨' },
  { name: 'Promotions', href: '/admin/promotions', icon: '🎟️' },
  { name: 'Customers', href: '/admin/customers', icon: '👥' },
  { name: 'Inventory', href: '/admin/inventory', icon: '📊' },
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
    // Load sidebar state from localStorage
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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-yametee-dark">
        <p className="text-gray-900 dark:text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-yametee-dark transition-colors duration-300">
      <nav className="bg-white dark:bg-yametee-gray border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-yametee-dark transition-colors text-gray-700 dark:text-gray-300"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            <Link href="/admin" className="text-xl font-bold text-gray-900 dark:text-white">
              YAMETEE Admin
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              View Store
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('adminToken')
                router.push('/admin/login')
              }}
              className="text-gray-600 dark:text-gray-400 hover:text-yametee-red transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`bg-white dark:bg-yametee-gray border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-73px)] transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
          }`}
        >
          <nav className={`p-4 space-y-2 ${sidebarOpen ? '' : 'hidden'}`}>
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === '/admin' && pathname === '/admin') ||
                (item.href !== '/admin' && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-yametee-red text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-yametee-dark'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </aside>
        {/* Main Content */}
        <main className={`flex-1 container mx-auto px-4 py-8 transition-all duration-300`}>
          {children}
        </main>
      </div>
    </div>
  )
}
