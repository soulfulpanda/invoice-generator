"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"

interface BlogPost {
  id?: number
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string
  keywords: string
  meta_description: string
  published: boolean
}

interface BlogPostEditorProps {
  post?: BlogPost | null
  onSave?: () => void
}

export function BlogPostEditor({ post, onSave }: BlogPostEditorProps) {
  const [formData, setFormData] = useState<BlogPost>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featured_image: "",
    keywords: "",
    meta_description: "",
    published: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (post) {
      setFormData(post)
    } else {
      setFormData({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        featured_image: "",
        keywords: "",
        meta_description: "",
        published: false,
      })
    }
  }, [post])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }))
  }

  const handleSave = async () => {
    if (!formData.title || !formData.slug || !formData.content) {
      toast({
        title: "Validation Error",
        description: "Title, slug, and content are required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const method = post?.id ? "PUT" : "POST"
      const response = await fetch("/api/blog-posts", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: `Post ${post?.id ? "updated" : "created"} successfully`,
        })
        onSave?.()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to save post",
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post?.id ? "Edit Post" : "Create New Post"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter post title"
            />
          </div>
          <div>
            <Label htmlFor="slug">URL Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="url-friendly-slug"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
            placeholder="Brief description of the post"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="content">Content *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            placeholder="Write your post content in Markdown..."
            rows={15}
            className="font-mono"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="featured_image">Featured Image URL</Label>
            <Input
              id="featured_image"
              value={formData.featured_image}
              onChange={(e) => setFormData((prev) => ({ ...prev, featured_image: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              value={formData.keywords}
              onChange={(e) => setFormData((prev) => ({ ...prev, keywords: e.target.value }))}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="meta_description">Meta Description</Label>
          <Textarea
            id="meta_description"
            value={formData.meta_description}
            onChange={(e) => setFormData((prev) => ({ ...prev, meta_description: e.target.value }))}
            placeholder="SEO meta description (150-160 characters)"
            rows={2}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={formData.published}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, published: checked }))}
          />
          <Label htmlFor="published">Published</Label>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : post?.id ? "Update Post" : "Create Post"}
          </Button>
          {post && (
            <Button variant="outline" onClick={() => onSave?.()}>
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
