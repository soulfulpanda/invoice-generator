import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"

const blogPosts = [
  {
    slug: "receipt-vs-invoice",
    title: "Receipt vs Invoice: Understanding the Differences",
    description:
      "Learn the key differences between receipts and invoices, when to use each, and how they impact your business operations and tax obligations.",
    image: "/Invoice vs Receipt.webp",
    readTime: "8 min read",
  },
  {
    slug: "invoice-payment-reminder",
    title: "Invoice Payment Reminder Tips: Get Paid Without Damaging Relationships",
    description:
      "Discover effective strategies for sending payment reminders that accelerate cash flow while maintaining positive client relationships.",
    image: "/Invoice Payment Reminder.webp",
    readTime: "12 min read",
  },
  {
    slug: "invoicing-guide-101",
    title: "Invoicing Guide 101: What You Need to Know",
    description:
      "Master the art of professional invoicing with this comprehensive guide covering legal requirements, best practices, and technology solutions.",
    image: "/Invoicing Guide 101.webp",
    readTime: "15 min read",
  },
  {
    slug: "invoice-factoring",
    title: "Invoice Factoring for Noobs: Getting Paid Faster",
    description:
      "Learn how invoice factoring can transform your cash flow by converting unpaid invoices into immediate cash for business growth.",
    image: "/Invoice Factoring.webp",
    readTime: "18 min read",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Invoice Generator Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert insights on invoicing, payment collection, and business finance to help you get paid faster and grow
            your business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-contain" />
              </div>
              <CardHeader>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-sm text-gray-500">{post.readTime}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
                <Link href={`/blog/${post.slug}`}>
                  <Button variant="outline" className="w-full bg-transparent">
                    Read More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
