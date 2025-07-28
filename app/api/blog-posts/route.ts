import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/neon"

export async function GET() {
  try {
    const posts = await sql`
      SELECT * FROM blog_posts 
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
    const body = await request.json()
    const { title, slug, content, excerpt, featured_image, keywords, meta_description, published } = body

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Title, slug, and content are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, keywords, meta_description, published, created_at, updated_at)
      VALUES (${title}, ${slug}, ${content}, ${excerpt || ""}, ${featured_image || ""}, ${keywords || ""}, ${meta_description || ""}, ${published || false}, NOW(), NOW())
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error: any) {
    console.error("Error creating post:", error)

    if (error.message?.includes("duplicate key")) {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, slug, content, excerpt, featured_image, keywords, meta_description, published } = body

    if (!id || !title || !slug || !content) {
      return NextResponse.json({ error: "ID, title, slug, and content are required" }, { status: 400 })
    }

    const result = await sql`
      UPDATE blog_posts 
      SET title = ${title}, slug = ${slug}, content = ${content}, excerpt = ${excerpt || ""}, 
          featured_image = ${featured_image || ""}, keywords = ${keywords || ""}, 
          meta_description = ${meta_description || ""}, published = ${published || false}, 
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error: any) {
    console.error("Error updating post:", error)

    if (error.message?.includes("duplicate key")) {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM blog_posts 
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
