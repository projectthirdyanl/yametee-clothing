import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-yametee-bg border-t border-yametee-lightGray/20 mt-20 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              QUICK LINKS
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-sm text-gray-600 dark:text-gray-400 hover:text-yametee-red transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-yametee-red transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-sm text-gray-600 dark:text-gray-400 hover:text-yametee-red transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-600 dark:text-gray-400 hover:text-yametee-red transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              SUPPORT
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="text-sm text-gray-600 dark:text-gray-400 hover:text-yametee-red transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-gray-600 dark:text-gray-400 hover:text-yametee-red transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-yametee-red transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              LEGAL
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-yametee-red transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-sm text-gray-600 dark:text-gray-400 hover:text-yametee-red transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-yametee-lightGray/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            © 2025 Yametee Studio. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            BUILT FOR TEES MADE IN MANILA
          </p>
        </div>
      </div>
    </footer>
  )
}
