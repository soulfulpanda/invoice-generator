"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase"
import { BlogPostEditor } from "./blog-post-editor"
import { toast } from "@/hooks/use-toast"

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string
  keywords: string
  meta_description: string
  published: boolean
  created_at: string
  updated_at: string
}

export function BlogPostList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)

  const fetchPosts = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("blog_posts").delete().eq("id", id)

      if (error) throw error

      setPosts((prev) => prev.filter((post) => post.id !== id))
      toast({
        title: "Success",
        description: "Post deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      })
    }
  }

  const handleTogglePublished = async (post: BlogPost) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("blog_posts").update({ published: !post.published }).eq("id", post.id)

      if (error) throw error

      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, published: !p.published } : p)))

      toast({
        title: "Success",
        description: `Post ${!post.published ? "published" : "unpublished"} successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      })
    }
  }

  if (editingPost) {
    return (
      <div>
        <Button onClick={() => setEditingPost(null)} variant="outline" className="mb-4">
          ← Back to Posts
        </Button>
        <BlogPostEditor
          post={editingPost}
          onSave={() => {
            setEditingPost(null)
            fetchPosts()
          }}
        />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2">Loading posts...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <Button onClick={fetchPosts} variant="outline">
          Refresh
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No posts found. Create your first post!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">Slug: /blog/{post.slug}</p>
                    <p className="text-sm text-gray-500">Created: {new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {post.excerpt && <p className="text-gray-600 mb-4">{post.excerpt}</p>}
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => setEditingPost(post)} variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button onClick={() => handleTogglePublished(post)} variant="outline" size="sm">
                    {post.published ? "Unpublish" : "Publish"}
                  </Button>
                  {post.published && (
                    <Button onClick={() => window.open(`/blog/${post.slug}`, "_blank")} variant="outline" size="sm">
                      View
                    </Button>
                  )}
                  <Button onClick={() => handleDelete(post.id)} variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
