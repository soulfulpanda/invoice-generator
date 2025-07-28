import { sql } from "@/lib/neon"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar } from "lucide-react"

interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string
  keywords: string
  meta_description: string
  created_at: string
  updated_at: string
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await sql`
      SELECT * FROM blog_posts 
      WHERE slug = ${slug} AND published = true
      LIMIT 1
    `
    return (posts[0] as BlogPost) || null
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.meta_description || post.excerpt,
      images: post.featured_image ? [post.featured_image] : [],
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Simple markdown to HTML conversion for basic formatting
  const formatContent = (content: string) => {
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-2 mt-4">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/\n\n/gim, '</p><p class="mb-4">')
      .replace(/\n/gim, "<br>")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </div>

          <Card>
            {post.featured_image && (
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={post.featured_image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <CardContent className="p-8">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                  {post.updated_at !== post.created_at && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm">Updated: {formatDate(post.updated_at)}</span>
                    </div>
                  )}
                </div>

                {post.excerpt && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <p className="text-lg text-gray-700 italic">{post.excerpt}</p>
                  </div>
                )}
              </div>

              <div className="prose prose-lg max-w-none">
                <div
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: `<p class="mb-4">${formatContent(post.content)}</p>`,
                  }}
                />
              </div>

              {post.keywords && (
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">TAGS</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.keywords.split(",").map((keyword, index) => (
                      <Badge key={index} variant="secondary">
                        {keyword.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Try Our Free Invoice Generator
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
