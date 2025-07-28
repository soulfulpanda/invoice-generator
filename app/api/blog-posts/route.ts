import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"

export async function GET() {
  try {
    const posts = await sql`
      SELECT id, title, slug, excerpt, content, published, created_at, updated_at, meta_title, meta_description
      FROM blog_posts 
      ORDER BY created_at DESC
    `
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, slug, excerpt, content, published, meta_title, meta_description } = await request.json()

    const result = await sql`
      INSERT INTO blog_posts (title, slug, excerpt, content, published, meta_title, meta_description)
      VALUES (${title}, ${slug}, ${excerpt}, ${content}, ${published}, ${meta_title}, ${meta_description})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, title, slug, excerpt, content, published, meta_title, meta_description } = await request.json()

    const result = await sql`
      UPDATE blog_posts 
      SET title = ${title}, slug = ${slug}, excerpt = ${excerpt}, content = ${content}, 
          published = ${published}, meta_title = ${meta_title}, meta_description = ${meta_description},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Post ID required" }, { status: 400 })
    }

    await sql`DELETE FROM blog_posts WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
