import { sql } from "@/lib/neon"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  featured_image: string
  created_at: string
  published: boolean
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await sql`
      SELECT id, title, slug, excerpt, featured_image, created_at, published
      FROM blog_posts 
      WHERE published = true
      ORDER BY created_at DESC
    `
    return posts as BlogPost[]
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Insights, tips, and guides about invoicing, business finance, and more.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blog posts available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  {post.featured_image && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={post.featured_image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{formatDate(post.created_at)}</Badge>
                    </div>
                    <CardTitle className="text-xl hover:text-blue-600 transition-colors">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3">
                      {post.excerpt || "Read more to discover insights about this topic..."}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Back to Invoice Generator
          </Link>
        </div>
      </div>
    </div>
  )
}
