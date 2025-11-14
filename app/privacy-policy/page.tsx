import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white">Privacy Policy</h1>

          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-ul:text-gray-700 dark:prose-ul:text-gray-300">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">What Information We Collect</h2>
              <p className="mb-4">We collect the following information when you make a purchase or interact with our website:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Name, email address, phone number</li>
                <li>Shipping and billing address</li>
                <li>Order details and purchase history</li>
                <li>Payment information (processed securely through our payment gateway)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">How We Use Your Information</h2>
              <p className="mb-4">We use your information for:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Order processing and fulfillment</li>
                <li>Shipping and delivery coordination</li>
                <li>Customer support and communication</li>
                <li>Website analytics and improvement</li>
                <li>Marketing communications (with your consent)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">How We Protect Your Data</h2>
              <p>
                We implement industry-standard security measures to protect your personal information. All payment transactions are processed through secure, PCI-compliant payment gateways. We do not store your full payment card details on our servers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Third-Party Services</h2>
              <p className="mb-4">We may share your information with trusted third-party services for:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Payment processing (PayMongo)</li>
                <li>Shipping and logistics partners</li>
                <li>Website analytics tools</li>
              </ul>
              <p className="mt-4">These partners are required to maintain the confidentiality of your information.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Request access to your personal data</li>
                <li>Request corrections to inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Contact Us</h2>
              <p>
                For privacy concerns or to exercise your rights, please contact us at <strong className="text-yametee-red">support@yametee.ph</strong>
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
