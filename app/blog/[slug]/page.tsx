import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import fs from "fs"
import path from "path"
import type { Metadata } from "next"

const blogPosts = {
  "receipt-vs-invoice": {
    title: "Receipt vs Invoice: Understanding the Differences",
    description:
      "Learn the key differences between receipts and invoices, when to use each, and how they impact your business operations and tax obligations.",
    image: "/Invoice vs Receipt.webp",
    keywords: "receipt vs invoice, invoice receipt difference, business documents, accounting, tax records",
  },
  "invoice-payment-reminder": {
    title: "Invoice Payment Reminder Tips: Get Paid Without Damaging Relationships",
    description:
      "Discover effective strategies for sending payment reminders that accelerate cash flow while maintaining positive client relationships.",
    image: "/Invoice Payment Reminder.webp",
    keywords: "invoice payment reminder, payment collection, cash flow, client relationships, overdue invoices",
  },
  "invoicing-guide-101": {
    title: "Invoicing Guide 101: What You Need to Know",
    description:
      "Master the art of professional invoicing with this comprehensive guide covering legal requirements, best practices, and technology solutions.",
    image: "/Invoicing Guide 101.webp",
    keywords: "invoicing guide, professional invoicing, invoice best practices, business billing, invoice requirements",
  },
  "invoice-factoring": {
    title: "Invoice Factoring for Noobs: Getting Paid Faster",
    description:
      "Learn how invoice factoring can transform your cash flow by converting unpaid invoices into immediate cash for business growth.",
    image: "/Invoice Factoring.webp",
    keywords: "invoice factoring, cash flow, business financing, accounts receivable, working capital",
  },
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts[slug as keyof typeof blogPosts]

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | Invoice Generator Blog`,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.image],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = blogPosts[slug as keyof typeof blogPosts]

  if (!post) {
    notFound()
  }

  // Read the HTML file
  let htmlContent = ""
  try {
    const filePath = path.join(process.cwd(), "public", `${slug}.html`)
    htmlContent = fs.readFileSync(filePath, "utf8")
  } catch (error) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1">
        <Link href="/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Featured Image */}
          <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-contain bg-white" />
          </div>

          {/* Blog Content */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        </article>
      </div>
      <Footer />
    </div>
  )
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}
