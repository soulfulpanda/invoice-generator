"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BlogPostEditor } from "@/components/blog-post-editor"
import { BlogPostList } from "@/components/blog-post-list"
import { toast } from "@/hooks/use-toast"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [editingPost, setEditingPost] = useState(null)

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth")
    if (auth) {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        sessionStorage.setItem("admin_auth", "true")
        setIsAuthenticated(true)
        toast({ title: "Login successful", description: "Welcome to the admin dashboard" })
      } else {
        toast({ title: "Login failed", description: data.error, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Login failed", description: "Network error", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth")
    setIsAuthenticated(false)
    setUsername("")
    setPassword("")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="posts">Manage Posts</TabsTrigger>
            <TabsTrigger value="new">New Post</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <BlogPostList onEdit={setEditingPost} />
          </TabsContent>

          <TabsContent value="new">
            <BlogPostEditor post={editingPost} onSave={() => setEditingPost(null)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
