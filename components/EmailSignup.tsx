'use client'

import { useState } from 'react'

export default function EmailSignup() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    // TODO: Implement actual email subscription API call
    setTimeout(() => {
      setMessage('Thanks for joining! Check your email.')
      setEmail('')
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="bg-yametee-gray dark:bg-yametee-lightGray border border-yametee-lightGray/30 rounded-2xl p-6 md:p-8">
      <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
        STAY EARLY
      </p>
      
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
        Be first to cop every drop.
      </h3>
      
      <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
        Weekly tee sketches, drop timers, and studio stories straight to your inbox.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@yametee.club"
          required
          className="w-full px-4 py-3 bg-yametee-bg dark:bg-yametee-dark border border-yametee-lightGray/30 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yametee-red focus:border-transparent transition-all"
        />
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-yametee-red hover:bg-yametee-redDark text-white font-semibold py-3 px-6 rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-yametee-red/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'JOINING...' : 'JOIN THE LIST'}
        </button>
        
        {message && (
          <p className="text-sm text-yametee-red text-center">{message}</p>
        )}
      </form>
    </div>
  )
}

