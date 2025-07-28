"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye } from "lucide-react"

interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  published: boolean
  created_at: string
  updated_at: string
  meta_title: string
  meta_description: string
}

interface BlogPostListProps {
  posts: BlogPost[]
  onEdit: (post: BlogPost) => void
  onDelete: (id: number) => void
}

export function BlogPostList({ posts, onEdit, onDelete }: BlogPostListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">No blog posts yet. Create your first post!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl">{post.title}</CardTitle>
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
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDelete(post.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-2">
              <strong>Slug:</strong> /blog/{post.slug}
            </p>
            {post.excerpt && <p className="text-gray-700">{post.excerpt}</p>}
            <div className="mt-4 text-sm text-gray-500">Content length: {post.content.length} characters</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
