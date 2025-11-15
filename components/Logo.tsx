'use client'

import Image from 'next/image'
import { useTheme } from '@/contexts/ThemeContext'

export default function Logo({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const sizeClasses = {
    small: 'h-8 w-8',
    default: 'h-12 w-12',
    large: 'h-16 w-16'
  }

  const textSizes = {
    small: 'text-xs',
    default: 'text-sm',
    large: 'text-base'
  }

  return (
    <div 
      className={`
        flex items-center gap-3 
        ${isDark ? 'logo-white-glow' : 'border-[1.5px] border-yametee-black rounded-lg px-2 py-1'} 
        transition-all duration-300
      `}
    >
      {/* Logo Circle */}
      <div 
        className={`
          ${sizeClasses[size]} 
          rounded-full 
          flex items-center justify-center
          ${isDark 
            ? 'bg-yametee-red border-2 border-yametee-red logo-red-glow' 
            : 'bg-yametee-red border-2 border-yametee-black'
          }
          transition-all duration-300
        `}
      >
        <Image 
          src="/images/logos/logo-main.png" 
          alt="YAMETEE" 
          width={size === 'small' ? 24 : size === 'default' ? 36 : 48}
          height={size === 'small' ? 24 : size === 'default' ? 36 : 48}
          className={`${isDark ? 'invert' : ''} transition-all duration-300`}
          priority
        />
      </div>
      
      {/* Logo Text */}
      <div className={`flex flex-col ${isDark ? 'logo-white-glow' : ''}`}>
        <span className={`font-bold ${textSizes[size]} ${isDark ? 'text-white' : 'text-yametee-black'} tracking-tight`}>
          YAME TEE
        </span>
        {size !== 'small' && (
          <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-600'} tracking-wider uppercase`}>
            STREET UNIFORM
          </span>
        )}
      </div>
    </div>
  )
}

