import { createClient } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog - Invoice Generator",
  description: "Read our latest articles about invoicing, business finance, and more.",
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image: string
  keywords: string
  created_at: string
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, featured_image, keywords, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }

  return data || []
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600">Insights on invoicing, business finance, and entrepreneurship</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blog posts available yet.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                    <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {post.excerpt && <p className="text-gray-600 line-clamp-3 mb-4">{post.excerpt}</p>}
                    {post.keywords && (
                      <div className="flex flex-wrap gap-1">
                        {post.keywords
                          .split(",")
                          .slice(0, 3)
                          .map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {keyword.trim()}
                            </Badge>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
