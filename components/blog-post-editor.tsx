"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactMarkdown from "react-markdown"

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

interface BlogPostEditorProps {
  post?: BlogPost | null
  onSave: (post: Partial<BlogPost>) => void
  onCancel: () => void
}

export function BlogPostEditor({ post, onSave, onCancel }: BlogPostEditorProps) {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [published, setPublished] = useState(false)
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")

  useEffect(() => {
    if (post) {
      setTitle(post.title)
      setSlug(post.slug)
      setContent(post.content)
      setExcerpt(post.excerpt)
      setPublished(post.published)
      setMetaTitle(post.meta_title || "")
      setMetaDescription(post.meta_description || "")
    } else {
      // Reset form for new post
      setTitle("")
      setSlug("")
      setContent("")
      setExcerpt("")
      setPublished(false)
      setMetaTitle("")
      setMetaDescription("")
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

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!post) {
      setSlug(generateSlug(value))
    }
  }

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required")
      return
    }

    onSave({
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      content: content.trim(),
      excerpt: excerpt.trim(),
      published,
      meta_title: metaTitle.trim(),
      meta_description: metaDescription.trim(),
    })
  }

  const insertMarkdown = (syntax: string) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement
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

    // Focus back to textarea
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + newText.length, start + newText.length)
    }, 0)
  }

  return (
    <Card>
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
              placeholder="Enter post title"
            />
          </div>
          <div>
            <Label htmlFor="slug">URL Slug</Label>
            <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="url-slug" />
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
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-2 border-b flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => insertMarkdown("bold")}>
                <strong>B</strong>
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertMarkdown("italic")}>
                <em>I</em>
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertMarkdown("heading")}>
                H2
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
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger value="write" className="rounded-none">
                  Write
                </TabsTrigger>
                <TabsTrigger value="preview" className="rounded-none">
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="write" className="mt-0">
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content in Markdown..."
                  rows={15}
                  className="border-0 rounded-none resize-none focus-visible:ring-0"
                />
              </TabsContent>

              <TabsContent value="preview" className="mt-0">
                <div className="p-4 min-h-[400px] prose prose-sm max-w-none">
                  {content ? (
                    <ReactMarkdown>{content}</ReactMarkdown>
                  ) : (
                    <p className="text-gray-500">Nothing to preview yet...</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="meta-title">SEO Title</Label>
            <Input
              id="meta-title"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="SEO optimized title"
            />
          </div>
          <div>
            <Label htmlFor="meta-description">SEO Description</Label>
            <Input
              id="meta-description"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="SEO meta description"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="published" checked={published} onCheckedChange={setPublished} />
          <Label htmlFor="published">Published</Label>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave}>{post ? "Update Post" : "Create Post"}</Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
