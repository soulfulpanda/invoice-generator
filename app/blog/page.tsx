import { sql } from "@/lib/neon"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  created_at: string
  meta_title: string
  meta_description: string
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await sql`
      SELECT id, title, slug, excerpt, created_at, meta_title, meta_description
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600">Insights and guides about invoicing, business finance, and more.</p>
        </div>

        {posts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No blog posts published yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">
                        <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                          {post.title}
                        </Link>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{formatDate(post.created_at)}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {post.excerpt && <p className="text-gray-700 mb-4">{post.excerpt}</p>}
                  <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800 font-medium">
                    Read more →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Invoice Generator
          </Link>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: "Blog - Free Invoice Generator",
  description: "Insights and guides about invoicing, business finance, and more.",
}
