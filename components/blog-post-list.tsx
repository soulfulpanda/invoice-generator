"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  published: boolean
  created_at: string
  updated_at: string
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

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No blog posts yet. Create your first post!</p>
          </CardContent>
        </Card>
      ) : (
        posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Created: {formatDate(post.created_at)}
                    {post.updated_at !== post.created_at && <span> • Updated: {formatDate(post.updated_at)}</span>}
                  </p>
                </div>
                <Badge variant={post.published ? "default" : "secondary"}>
                  {post.published ? "Published" : "Draft"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(post)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(post.id)}>
                  Delete
                </Button>
                {post.published && (
                  <Button variant="ghost" size="sm" onClick={() => window.open(`/blog/${post.slug}`, "_blank")}>
                    View
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
