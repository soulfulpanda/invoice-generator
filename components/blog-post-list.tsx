"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Pencil, Trash2, Eye } from "lucide-react"

interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  published: boolean
  created_at: string
  updated_at: string
}

interface BlogPostListProps {
  onEdit: (post: BlogPost) => void
}

export function BlogPostList({ onEdit }: BlogPostListProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog-posts")
      const data = await response.json()

      if (response.ok) {
        setPosts(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch posts",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return
    }

    try {
      const response = await fetch(`/api/blog-posts?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Post deleted successfully",
        })
        fetchPosts()
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to delete post",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading posts...</div>
        </CardContent>
      </Card>
    )
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">No posts found. Create your first post!</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{post.title}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                  <span className="text-sm text-gray-500">Created: {formatDate(post.created_at)}</span>
                  {post.updated_at !== post.created_at && (
                    <span className="text-sm text-gray-500">Updated: {formatDate(post.updated_at)}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {post.published && (
                  <Button variant="outline" size="sm" onClick={() => window.open(`/blog/${post.slug}`, "_blank")}>
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => onEdit(post)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(post.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">{post.excerpt || post.content.substring(0, 150) + "..."}</p>
            <div className="mt-2">
              <span className="text-xs text-gray-500">Slug: /{post.slug}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
