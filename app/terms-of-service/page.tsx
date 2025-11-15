import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white">Terms of Service</h1>

          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-a:text-yametee-red">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Ordering & Payment</h2>
              <p className="mb-4">
                By placing an order on Yametee, you agree to provide accurate and complete information. All prices are in Philippine Peso (PHP) and are subject to change without notice.
              </p>
              <p>
                Payment must be completed through our secure payment gateway. Orders are not confirmed until payment is verified.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Shipping and Delivery</h2>
              <p className="mb-4">
                We ship nationwide within the Philippines. Delivery times vary by location. Please refer to our <Link href="/shipping" className="text-yametee-red hover:underline">Shipping & Delivery</Link> page for estimated delivery times.
              </p>
              <p>
                We are not responsible for delays caused by courier services or customs. Risk of loss passes to you upon delivery to the shipping address provided.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Return and Exchange Policy</h2>
              <p>
                Please refer to our <Link href="/returns" className="text-yametee-red hover:underline">Returns & Exchanges</Link> page for detailed information about our return and exchange policies. All returns must meet the conditions specified in our policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Limitations of Liability</h2>
              <p>
                Yametee shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products. Our total liability shall not exceed the amount you paid for the product in question.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Intellectual Property</h2>
              <p className="mb-4">
                All designs, logos, images, and content on this website are the property of Yametee and are protected by copyright and trademark laws. You may not:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Reproduce or distribute our designs without permission</li>
                <li>Use our trademarks or logos without authorization</li>
                <li>Create derivative works based on our designs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this page. Your continued use of our website constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Contact</h2>
              <p>
                If you have questions about these terms, please contact us at <strong className="text-yametee-red">support@yametee.ph</strong>
              </p>
            </section>

            <div className="bg-gray-100 dark:bg-yametee-gray border-l-4 border-yametee-red p-4 mt-6">
              <p className="text-gray-700 dark:text-gray-300 italic">
                <strong className="text-gray-900 dark:text-white">Last Updated:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
