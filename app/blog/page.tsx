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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Invoice Generator Blog</h1>
            <p className="text-xl text-gray-600">Tips, guides, and insights for better invoicing</p>
          </div>

          {posts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No blog posts published yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl mb-2">
                          <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                            {post.title}
                          </Link>
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <Badge variant="secondary">Blog</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      Read more →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata() {
  return {
    title: "Blog - Free Invoice Generator",
    description: "Tips, guides, and insights for better invoicing and business management.",
  }
}
