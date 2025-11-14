import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-yametee-gray border-t border-gray-200 dark:border-yametee-lightGray/30 mt-20 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <p className="text-lg font-bold mb-2 text-gray-900 dark:text-white">YAMETEE</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              <strong className="text-gray-900 dark:text-white">Yametee is a Filipino anime streetwear brand</strong> inspired by Japanese pop culture and the phrase <em>&quot;yamete kudasai&quot;</em>.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We design bold, high-quality anime graphic tees made for everyday wear—from binge-watching days to night-outs with the tropa.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-sm text-gray-600 dark:text-gray-400 hover:text-yametee-red transition-colors">Products</Link></li>
              <li><Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-yametee-red transition-colors">About Us</Link></li>
              <li><Link href="/size-guide" className="text-sm text-gray-600 dark:text-gray-400 hover:text-yametee-red transition-colors">Size Guide</Link></li>
              <li><Link href="/faq" className="text-sm text-gray-600 dark:text-gray-400 hover:text-yametee-red transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/shipping" className="text-sm text-gray-600 dark:text-gray-400 hover:text-yametee-red transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/returns" className="text-sm text-gray-600 dark:text-gray-400 hover:text-yametee-red transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-yametee-red transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy-policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-yametee-red transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-gray-600 dark:text-gray-400 hover:text-yametee-red transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} Yametee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
