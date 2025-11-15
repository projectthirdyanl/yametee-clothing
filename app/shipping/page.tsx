import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white">Shipping & Delivery</h1>

          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Processing Time</h2>
              <p>
                Orders are usually processed within <strong>1–2 business days</strong> after payment confirmation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Delivery Time (Philippines)</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong className="text-gray-900 dark:text-white">Metro Manila:</strong> 2–4 business days</li>
                <li><strong className="text-gray-900 dark:text-white">Luzon:</strong> 3–5 business days</li>
                <li><strong className="text-gray-900 dark:text-white">Visayas & Mindanao:</strong> 5–7 business days</li>
              </ul>
              <p className="mt-4">
                We work with trusted couriers to make sure your Yametee order arrives safely.  
                Once your order is shipped, you&apos;ll receive a <strong>tracking number</strong> via email or SMS (where available).
              </p>
            </section>

            <div className="bg-gray-100 dark:bg-yametee-gray border-l-4 border-yametee-red p-4 mt-6">
              <p className="text-gray-700 dark:text-gray-300 italic">
                <strong className="text-gray-900 dark:text-white">Note:</strong> Business days do not include Sundays and holidays.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
