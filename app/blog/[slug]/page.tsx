import { sql } from "@/lib/neon"
import { notFound } from "next/navigation"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { Badge } from "@/components/ui/badge"

interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  created_at: string
  updated_at: string
  meta_title: string
  meta_description: string
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await sql`
      SELECT id, title, slug, content, excerpt, created_at, updated_at, meta_title, meta_description
      FROM blog_posts 
      WHERE slug = ${slug} AND published = true
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
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      type: "article",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
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

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block">
            ← Back to Blog
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            <Badge variant="secondary">Published {formatDate(post.created_at)}</Badge>
            {post.updated_at !== post.created_at && (
              <Badge variant="outline">Updated {formatDate(post.updated_at)}</Badge>
            )}
          </div>

          {post.excerpt && <p className="text-xl text-gray-600 mb-8 leading-relaxed">{post.excerpt}</p>}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>,
                p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="mb-4 pl-6 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="mb-4 pl-6 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-700">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-blue-600 hover:text-blue-800 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Blog
          </Link>
        </div>
      </article>
    </div>
  )
}
