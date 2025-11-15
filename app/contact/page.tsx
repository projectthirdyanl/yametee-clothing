import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white">Contact Us</h1>

          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white">
            <p className="text-lg mb-8">
              Got questions about sizing, orders, or collabs? We&apos;re here to help.
            </p>

            <div className="bg-white dark:bg-yametee-gray border border-gray-200 dark:border-gray-700 rounded-lg p-8 mb-8">
              <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                <li>
                  <strong className="text-gray-900 dark:text-white block mb-1">Email:</strong>
                  <a href="mailto:support@yametee.ph" className="text-yametee-red hover:underline">
                    support@yametee.ph
                  </a>
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-white block mb-1">TikTok / Socials:</strong>
                  <span className="text-gray-700 dark:text-gray-300">@yametee</span>
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-white block mb-1">Business Hours:</strong>
                  <span className="text-gray-700 dark:text-gray-300">Monday–Saturday, 9:00 AM – 6:00 PM (PH time)</span>
                </li>
              </ul>
            </div>

            <p className="text-gray-700 dark:text-gray-300">
              We try our best to respond within <strong className="text-gray-900 dark:text-white">24 hours</strong> on business days.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
