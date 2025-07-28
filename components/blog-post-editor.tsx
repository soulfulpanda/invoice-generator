"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"

interface BlogPost {
  id?: string
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
  post?: BlogPost
  onSave?: () => void
}

export function BlogPostEditor({ post, onSave }: BlogPostEditorProps) {
  const [formData, setFormData] = useState<BlogPost>({
    title: post?.title || "",
    slug: post?.slug || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    featured_image: post?.featured_image || "",
    keywords: post?.keywords || "",
    meta_description: post?.meta_description || "",
    published: post?.published || false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)

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

  const insertFormatting = (before: string, after = "") => {
    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const newText = before + selectedText + after

    const newContent = textarea.value.substring(0, start) + newText + textarea.value.substring(end)

    setFormData((prev) => ({ ...prev, content: newContent }))

    // Set cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const handleImageUpload = async (file: File) => {
    setImageUploading(true)
    try {
      const supabase = createClient()
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`

      const { data, error } = await supabase.storage.from("blog-images").upload(fileName, file)

      if (error) throw error

      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image",
        variant: "destructive",
      })
      return null
    } finally {
      setImageUploading(false)
    }
  }

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = await handleImageUpload(file)
    if (url) {
      setFormData((prev) => ({ ...prev, featured_image: url }))
    }
  }

  const handleSave = async () => {
    if (!formData.title || !formData.slug || !formData.content) {
      toast({
        title: "Validation error",
        description: "Title, slug, and content are required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()

      if (post?.id) {
        // Update existing post
        const { error } = await supabase
          .from("blog_posts")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", post.id)

        if (error) throw error
      } else {
        // Create new post
        const { error } = await supabase.from("blog_posts").insert([formData])

        if (error) throw error
      }

      toast({
        title: "Success",
        description: post?.id ? "Post updated successfully" : "Post created successfully",
      })

      if (onSave) onSave()
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message || "Failed to save post",
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
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter post title"
            />
          </div>
          <div>
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="url-slug"
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
          <Label>Featured Image</Label>
          <div className="space-y-2">
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFeaturedImageUpload}
              accept="image/*"
              disabled={imageUploading}
            />
            {formData.featured_image && (
              <img
                src={formData.featured_image || "/placeholder.svg"}
                alt="Featured"
                className="w-32 h-32 object-cover rounded"
              />
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <div className="border rounded-md">
            <div className="border-b p-2 flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => insertFormatting("**", "**")}>
                Bold
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertFormatting("*", "*")}>
                Italic
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertFormatting("## ")}>
                H2
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertFormatting("### ")}>
                H3
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertFormatting("[", "](url)")}>
                Link
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertFormatting("- ")}>
                List
              </Button>
            </div>
            <Textarea
              ref={contentRef}
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Write your post content in Markdown..."
              rows={15}
              className="border-0 resize-none focus:ring-0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              value={formData.keywords}
              onChange={(e) => setFormData((prev) => ({ ...prev, keywords: e.target.value }))}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
          <div>
            <Label htmlFor="meta_description">Meta Description</Label>
            <Input
              id="meta_description"
              value={formData.meta_description}
              onChange={(e) => setFormData((prev) => ({ ...prev, meta_description: e.target.value }))}
              placeholder="SEO meta description"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={formData.published}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, published: checked }))}
          />
          <Label htmlFor="published">Published</Label>
        </div>

        <div className="flex justify-end space-x-2">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : post?.id ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
