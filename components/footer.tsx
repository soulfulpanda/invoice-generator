import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4">Invoice Generator</h3>
            <p className="text-gray-400 text-sm">
              Generate professional invoices for free with our clean, easy-to-use invoice template right in your
              browser.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog/invoicing-guide-101" className="text-gray-400 hover:text-white transition-colors">
                  Invoicing Guide 101
                </Link>
              </li>
              <li>
                <Link href="/blog/receipt-vs-invoice" className="text-gray-400 hover:text-white transition-colors">
                  Receipt vs Invoice
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/invoice-payment-reminder"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Payment Reminder Tips
                </Link>
              </li>
              <li>
                <Link href="/blog/invoice-factoring" className="text-gray-400 hover:text-white transition-colors">
                  Invoice Factoring Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-semibold mb-4">Tools</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Invoice Generator
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Invoice Generator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
