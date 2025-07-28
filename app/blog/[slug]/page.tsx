import { createClient } from "@/lib/supabase"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import ReactMarkdown from "react-markdown"

interface BlogPost {
  id: string
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
  const supabase = createClient()

  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).single()

  if (error || !data) {
    return null
  }

  return data
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
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

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-4xl mx-auto px-4 py-12">
        {post.featured_image && (
          <div className="aspect-video overflow-hidden rounded-lg mb-8">
            <img
              src={post.featured_image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-600 text-sm">
            <time dateTime={post.created_at}>
              {new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {post.updated_at !== post.created_at && (
              <>
                <span className="mx-2">•</span>
                <span>
                  Updated{" "}
                  {new Date(post.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </>
            )}
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  )
}
