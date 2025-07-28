"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactMarkdown from "react-markdown"

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  published: boolean
  meta_title: string
  meta_description: string
}

interface BlogPostEditorProps {
  post?: BlogPost | null
  onSave: () => void
  onCancel: () => void
}

export function BlogPostEditor({ post, onSave, onCancel }: BlogPostEditorProps) {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [published, setPublished] = useState(false)
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setSlug(post.slug)
      setExcerpt(post.excerpt)
      setContent(post.content)
      setPublished(post.published)
      setMetaTitle(post.meta_title || "")
      setMetaDescription(post.meta_description || "")
    }
  }, [post])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!post) {
      setSlug(generateSlug(value))
    }
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      const postData = {
        title,
        slug,
        excerpt,
        content,
        published,
        meta_title: metaTitle,
        meta_description: metaDescription,
      }

      const url = "/api/blog-posts"
      const method = post ? "PUT" : "POST"

      if (post) {
        postData.id = post.id
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      })

      if (response.ok) {
        onSave()
      } else {
        throw new Error("Failed to save post")
      }
    } catch (error) {
      console.error("Error saving post:", error)
      alert("Failed to save post")
    } finally {
      setSaving(false)
    }
  }

  const insertMarkdown = (syntax: string) => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    let newText = ""
    switch (syntax) {
      case "bold":
        newText = `**${selectedText || "bold text"}**`
        break
      case "italic":
        newText = `*${selectedText || "italic text"}*`
        break
      case "heading":
        newText = `## ${selectedText || "Heading"}`
        break
      case "link":
        newText = `[${selectedText || "link text"}](url)`
        break
      case "image":
        newText = `![${selectedText || "alt text"}](image-url)`
        break
      case "code":
        newText = `\`${selectedText || "code"}\``
        break
      case "list":
        newText = `- ${selectedText || "list item"}`
        break
    }

    const newContent = content.substring(0, start) + newText + content.substring(end)
    setContent(newContent)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + newText.length, start + newText.length)
    }, 0)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{post ? "Edit Post" : "Create New Post"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Post title"
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="post-slug" />
          </div>
        </div>

        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief description of the post"
            rows={3}
          />
        </div>

        <div>
          <Label>Content</Label>
          <div className="border rounded-lg">
            <div className="border-b p-2 flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => insertMarkdown("bold")}>
                <strong>B</strong>
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertMarkdown("italic")}>
                <em>I</em>
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertMarkdown("heading")}>
                H
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertMarkdown("link")}>
                Link
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertMarkdown("image")}>
                Image
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertMarkdown("code")}>
                Code
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertMarkdown("list")}>
                List
              </Button>
            </div>

            <Tabs defaultValue="write" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="write" className="p-0">
                <Textarea
                  name="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content in Markdown..."
                  rows={15}
                  className="border-0 resize-none focus:ring-0"
                />
              </TabsContent>
              <TabsContent value="preview" className="p-4 min-h-[300px]">
                <div className="prose max-w-none">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="meta-title">Meta Title (SEO)</Label>
            <Input
              id="meta-title"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="SEO title"
            />
          </div>
          <div>
            <Label htmlFor="meta-description">Meta Description (SEO)</Label>
            <Input
              id="meta-description"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="SEO description"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="published" checked={published} onCheckedChange={setPublished} />
          <Label htmlFor="published">Published</Label>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Post"}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
