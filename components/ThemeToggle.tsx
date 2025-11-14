'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="relative w-12 h-6 rounded-full bg-gray-200 dark:bg-yametee-gray">
        <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white dark:bg-yametee-red" />
      </div>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 rounded-full bg-gray-200 dark:bg-yametee-gray transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yametee-red focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-yametee-bg"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white dark:bg-yametee-red transition-transform duration-300 flex items-center justify-center shadow-md ${
          theme === 'light' ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {theme === 'dark' ? (
          <MoonIcon className="w-3 h-3 text-white" />
        ) : (
          <SunIcon className="w-3 h-3 text-yametee-red" />
        )}
      </div>
    </button>
  )
}
