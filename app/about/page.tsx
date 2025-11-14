import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white">About Yametee</h1>

          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Who We Are</h2>
              <p className="mb-4">
                Yametee is an anime-inspired streetwear brand based in the Philippines.  
                Our name comes from a playful twist on the Japanese phrase <em>"yamete kudasai"</em>, but our goal is serious:
              </p>
              <p>
                To create high-quality, comfortable, and stylish anime tees that fans are proud to wear anywhere—hindi lang sa bahay, pero kahit sa mall, school, o night-out.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">What We Stand For</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong className="text-gray-900 dark:text-white">Premium feel, everyday comfort</strong> – We carefully choose fabric and print quality so your shirts feel good and last longer.</li>
                <li><strong className="text-gray-900 dark:text-white">Anime-first designs</strong> – Every graphic is inspired by iconic moments, characters, and scenes from the anime world.</li>
                <li><strong className="text-gray-900 dark:text-white">Clean, modern streetwear</strong> – Minimalist cuts and colors (black, white, red) that still look good even if people don't know the anime reference.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Why We Started</h2>
              <p className="mb-4">
                We're anime fans too. We got tired of low-quality, generic prints and wanted something that feels like legit streetwear—but with anime soul.
              </p>
              <p>
                Yametee is our way of bringing that mix of <strong>Japanese pop culture + everyday streetwear</strong> to your wardrobe.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Built for the Community</h2>
              <p className="mb-4">
                We listen to our community when we create new drops—what shows you're watching, which characters you love, and what style you vibe with.
              </p>
              <p>
                Every purchase supports a local team of designers, printers, and staff who love anime as much as you do.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
