'use client'

export default function AnnouncementBar() {
  const announcements = [
    "🎉 Free Shipping on Orders Over ₱1,500!",
    "🔥 New Collection Dropping Soon - Stay Tuned!",
    "✨ Limited Edition Designs Available Now",
    "💫 Follow us on Social Media for Exclusive Deals"
  ]

  return (
    <div className="relative overflow-hidden bg-yametee-red text-white py-2.5 border-b border-yametee-red/30 shadow-md">
      <div className="flex animate-scroll whitespace-nowrap">
        {/* Duplicate announcements for seamless infinite loop */}
        {[...announcements, ...announcements, ...announcements].map((announcement, index) => (
          <div
            key={index}
            className="inline-flex items-center mx-12 text-sm md:text-base font-semibold tracking-wide"
          >
            <span className="drop-shadow-sm">{announcement}</span>
            <span className="mx-4 text-yellow-300">•</span>
          </div>
        ))}
      </div>
      {/* Gradient overlays for smooth fade effect on edges */}
      <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-[#FF0404] via-[#FF0404]/80 to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#FF0404] via-[#FF0404]/80 to-transparent pointer-events-none z-10" />
    </div>
  )
}

