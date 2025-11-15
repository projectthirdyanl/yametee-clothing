import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white">Returns & Exchanges</h1>

          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white">
            <p className="text-lg mb-8">
              We want you to love your Yametee.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">When Can I Request an Exchange?</h2>
              <p className="mb-4">You may request an exchange if:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>You received the <strong className="text-gray-900 dark:text-white">wrong size</strong></li>
                <li>You received the <strong className="text-gray-900 dark:text-white">wrong design</strong></li>
                <li>The item has a <strong className="text-gray-900 dark:text-white">major print or fabric defect</strong> upon arrival</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Conditions for Exchange</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Request must be made within <strong className="text-gray-900 dark:text-white">7 days</strong> of receiving the item</li>
                <li>Item must be <strong className="text-gray-900 dark:text-white">unused, unwashed</strong>, and with original tags/packaging</li>
                <li>The item should be in the same condition as received</li>
              </ul>
            </section>

            <section className="mb-8">
              <p className="text-gray-700 dark:text-gray-300">
                For size changes and other concerns, message us on our official page or email us at <strong className="text-yametee-red">support@yametee.ph</strong> with your <strong className="text-gray-900 dark:text-white">order number</strong> and a <strong className="text-gray-900 dark:text-white">clear photo</strong> of the item.
              </p>
            </section>

            <div className="bg-gray-100 dark:bg-yametee-gray border-l-4 border-yametee-red p-4 mt-6">
              <p className="text-gray-700 dark:text-gray-300 italic">
                <strong className="text-gray-900 dark:text-white">Note:</strong> For sanitary and quality reasons, we may not accept returns for items that show signs of wear, damage, or strong odor.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
