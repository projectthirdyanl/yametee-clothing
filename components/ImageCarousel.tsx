'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface ImageCarouselProps {
  images: Array<{ id: string; imageUrl: string; color?: string | null; isPrimary?: boolean }>
  selectedColor?: string
  productName: string
}

export default function ImageCarousel({ images, selectedColor, productName }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Filter and sort images by color if selectedColor is provided
  const filteredImages = useMemo(() => {
    if (!images || images.length === 0) return []
    
    const filtered = selectedColor
      ? images.filter((img) => {
          // Include images that match the selected color
          // Also include images with no color assigned (generic product images) as fallback
          return img.color === selectedColor || !img.color || img.color === null
        })
      : images

    return filtered.sort((a, b) => {
      if (selectedColor) {
        // First priority: Primary image for the selected color
        const aIsPrimaryForColor = a.isPrimary && a.color === selectedColor
        const bIsPrimaryForColor = b.isPrimary && b.color === selectedColor
        if (aIsPrimaryForColor && !bIsPrimaryForColor) return -1
        if (!aIsPrimaryForColor && bIsPrimaryForColor) return 1
        
        // Second priority: Any image matching the selected color (over generic images)
        if (a.color === selectedColor && b.color !== selectedColor) return -1
        if (a.color !== selectedColor && b.color === selectedColor) return 1
      }
      
      // Third priority: Primary images (for generic/fallback images)
      if (a.isPrimary && !b.isPrimary) return -1
      if (!a.isPrimary && b.isPrimary) return 1
      
      return 0
    })
  }, [images, selectedColor])

  // Reset to first image when color or images change
  useEffect(() => {
    setCurrentIndex(0)
  }, [selectedColor, filteredImages.length])

  // Ensure currentIndex is always valid when filteredImages changes
  useEffect(() => {
    if (filteredImages.length > 0 && currentIndex >= filteredImages.length) {
      setCurrentIndex(0)
    } else if (filteredImages.length === 0) {
      setCurrentIndex(0)
    }
  }, [filteredImages.length, currentIndex])

  const goToPrevious = useCallback(() => {
    if (filteredImages.length === 0) return
    setCurrentIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1))
  }, [filteredImages.length])

  const goToNext = useCallback(() => {
    if (filteredImages.length === 0) return
    setCurrentIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1))
  }, [filteredImages.length])

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < filteredImages.length) {
      setCurrentIndex(index)
    }
  }, [filteredImages.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    setTouchEnd(null)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return
    
    const distance = touchStart - touchEnd
    const minSwipeDistance = 50

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // Swiped left - go to next
        goToNext()
      } else {
        // Swiped right - go to previous
        goToPrevious()
      }
    }
    
    // Reset touch states
    setTouchStart(null)
    setTouchEnd(null)
  }

  // Keyboard navigation
  useEffect(() => {
    if (filteredImages.length <= 1) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [filteredImages.length, goToPrevious, goToNext])

  if (filteredImages.length === 0) {
    return (
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-yametee-gray dark:to-yametee-dark rounded-xl overflow-hidden flex items-center justify-center border border-gray-200 dark:border-yametee-lightGray/20">
        <span className="text-gray-400 dark:text-gray-500 text-lg">No Image Available</span>
      </div>
    )
  }

  const hoverIndex = filteredImages.length > 1 ? (currentIndex + 1) % filteredImages.length : null
  const currentImage = filteredImages[currentIndex]
  const hoverImage = hoverIndex !== null ? filteredImages[hoverIndex] : null

  return (
    <div className="relative">
      {/* Main Image Display */}
      <div
        className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-yametee-gray dark:to-yametee-dark rounded-xl overflow-hidden relative group border border-gray-200 dark:border-yametee-lightGray/20"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {currentImage && (
          <>
            <img
              src={currentImage.imageUrl}
              alt={`${productName} - Image ${currentIndex + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
                hoverImage ? 'opacity-100 group-hover:opacity-0' : 'opacity-100'
              } group-hover:scale-105`}
              key={`${currentImage.id || currentIndex}-${selectedColor || 'default'}-primary`}
            />
            {hoverImage && (
              <img
                src={hoverImage.imageUrl}
                alt={`${productName} - Alternate view`}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
                key={`${hoverImage.id || hoverIndex}-${selectedColor || 'default'}-hover`}
              />
            )}
          </>
        )}

        {/* Navigation Arrows */}
        {filteredImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                goToPrevious()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity backdrop-blur-sm z-20 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity backdrop-blur-sm z-20 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {filteredImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {filteredImages.length}
          </div>
        )}

        {/* Dots Indicator */}
        {filteredImages.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-2 z-20">
            {filteredImages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  goToIndex(index)
                }}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  index === currentIndex
                    ? 'bg-yametee-red w-6'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {filteredImages.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filteredImages.map((image, index) => (
            <button
              key={image.id || index}
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                goToIndex(index)
              }}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                index === currentIndex
                  ? 'border-yametee-red ring-2 ring-yametee-red/50'
                  : 'border-gray-300 dark:border-yametee-lightGray/30 hover:border-gray-400 dark:hover:border-yametee-lightGray/50'
              }`}
            >
              <img
                src={image.imageUrl}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover pointer-events-none"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
