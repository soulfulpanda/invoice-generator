"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BlogPostEditor } from "@/components/blog-post-editor"
import { BlogPostList } from "@/components/blog-post-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/check")
      if (response.ok) {
        setIsAuthenticated(true)
        fetchPosts()
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        setIsAuthenticated(true)
        fetchPosts()
      } else {
        setLoginError("Invalid credentials")
      }
    } catch (error) {
      setLoginError("Login failed")
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog-posts")
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    }
  }

  const handleSavePost = async (postData: Partial<BlogPost>) => {
    try {
      const method = editingPost ? "PUT" : "POST"
      const body = editingPost ? { ...postData, id: editingPost.id } : postData

      const response = await fetch("/api/blog-posts", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        fetchPosts()
        setEditingPost(null)
      } else {
        throw new Error("Failed to save post")
      }
    } catch (error) {
      console.error("Save failed:", error)
      alert("Failed to save post")
    }
  }

  const handleDeletePost = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const response = await fetch(`/api/blog-posts?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchPosts()
      } else {
        throw new Error("Failed to delete post")
      }
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Failed to delete post")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {loginError && <div className="text-red-600 text-sm">{loginError}</div>}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your blog posts</p>
        </div>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="posts">All Posts</TabsTrigger>
            <TabsTrigger value="editor">{editingPost ? "Edit Post" : "New Post"}</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <BlogPostList posts={posts} onEdit={setEditingPost} onDelete={handleDeletePost} />
          </TabsContent>

          <TabsContent value="editor">
            <BlogPostEditor post={editingPost} onSave={handleSavePost} onCancel={() => setEditingPost(null)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
