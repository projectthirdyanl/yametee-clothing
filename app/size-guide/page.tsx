import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white">Yametee Size Guide (Unisex Shirts)</h1>

          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300">
            <p className="text-lg mb-6">
              All our tees are <strong>unisex</strong> and true-to-size.  
              If you prefer a looser "oversized" look, we recommend going <strong>one size up</strong>.
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="bg-gray-100 dark:bg-yametee-gray">
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Size</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Length (inches)</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Width (inches)</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Recommended for…</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white dark:bg-yametee-dark">
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white font-semibold">S</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300">26</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300">19</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300">Petite / slim build</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-yametee-gray">
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white font-semibold">M</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300">28</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300">21</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300">Average build</td>
                  </tr>
                  <tr className="bg-white dark:bg-yametee-dark">
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white font-semibold">L</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300">30</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300">23</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300">Slightly bigger / taller</td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-yametee-gray">
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white font-semibold">XL</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300">32</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300">25</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300">Larger build / baggy fit</td>
                  </tr>
                  <tr className="bg-white dark:bg-yametee-dark">
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white font-semibold">2XL</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300">30</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300">23</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300">Plus size / extra baggy</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-gray-100 dark:bg-yametee-gray border-l-4 border-yametee-red p-4 mb-6">
              <p className="text-gray-700 dark:text-gray-300 italic">
                <strong className="text-gray-900 dark:text-white">Note:</strong> Actual measurements may vary by 0.5–1 inch due to manual cutting and sewing.
              </p>
            </div>

            <p className="text-lg">
              Not sure what to get?  
              <br />
              👉 Check this page before you order so you can get the fit you want.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
