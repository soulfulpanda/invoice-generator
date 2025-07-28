import { Footer } from "@/components/footer"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and using our invoice generator service, you accept and agree to be bound by the terms and
              provision of this agreement.
            </p>

            <h2>Use License</h2>
            <p>
              Permission is granted to temporarily use our invoice generator for personal and commercial use. This is
              the grant of a license, not a transfer of title.
            </p>

            <h2>Disclaimer</h2>
            <p>
              The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or
              implied, and hereby disclaim all other warranties.
            </p>

            <h2>Limitations</h2>
            <p>
              In no event shall our company or its suppliers be liable for any damages arising out of the use or
              inability to use the materials on our website.
            </p>

            <h2>User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate and complete information. You are
              responsible for safeguarding your account credentials.
            </p>

            <h2>Prohibited Uses</h2>
            <p>
              You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts, or to
              violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances.
            </p>

            <h2>Content</h2>
            <p>
              Our service allows you to create and store invoices. You retain all rights to your content, and we do not
              claim ownership of your invoices or data.
            </p>

            <h2>Termination</h2>
            <p>
              We may terminate or suspend your account and access to the service immediately, without prior notice, for
              conduct that we believe violates these terms.
            </p>

            <h2>Governing Law</h2>
            <p>
              These terms shall be governed and construed in accordance with applicable laws, without regard to its
              conflict of law provisions.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any changes by posting the
              updated terms on our website.
            </p>

            <h2>Contact Information</h2>
            <p>If you have any questions about these Terms of Service, please contact us through our website.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
