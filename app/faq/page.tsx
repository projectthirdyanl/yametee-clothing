import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white">Frequently Asked Questions (FAQ)</h1>

          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-yametee-red">
            <section className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">1. Are your shirts unisex?</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Yes, all Yametee shirts are unisex. You can refer to our <Link href="/size-guide" className="text-yametee-red hover:underline">Size Guide</Link> to find your best fit.
              </p>
            </section>

            <section className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">2. What fabric do you use?</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We use soft, breathable cotton or cotton-blend fabric chosen for comfort and durability.  
                Each design is printed with high-quality materials to help reduce fading and cracking over time.
              </p>
            </section>

            <section className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">3. How do I wash my Yametee shirts?</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-2">For best results:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Turn the shirt <strong className="text-gray-900 dark:text-white">inside-out</strong> before washing</li>
                <li>Use <strong className="text-gray-900 dark:text-white">gentle cycle</strong> and cold water</li>
                <li>Avoid bleach or harsh detergents</li>
                <li>Hang dry or use <strong className="text-gray-900 dark:text-white">low-heat</strong> tumble dry</li>
                <li>Do not iron directly on the print</li>
              </ul>
            </section>

            <section className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">4. Do you restock sold-out designs?</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Some designs are <strong className="text-gray-900 dark:text-white">limited drops</strong> and may not return once sold out, while popular designs may be restocked.  
                Follow us on TikTok for restock announcements and new drops.
              </p>
            </section>

            <section className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">5. Where are you based?</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We are proudly based in the <strong className="text-gray-900 dark:text-white">Philippines</strong>, shipping nationwide.
              </p>
            </section>

            <section className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">6. How can I track my order?</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Once your order has been shipped, we&apos;ll send your tracking details via email or SMS (where available).  
                You can use this tracking number on the courier&apos;s website to check the delivery status.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">7. Can I change my address after placing an order?</h2>
              <p className="text-gray-700 dark:text-gray-300">
                If your order is still in <strong className="text-gray-900 dark:text-white">processing</strong> and not yet shipped, we may still be able to update your address.  
                Contact us as soon as possible with your <strong className="text-gray-900 dark:text-white">order number</strong> and the <strong className="text-gray-900 dark:text-white">correct address</strong>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
