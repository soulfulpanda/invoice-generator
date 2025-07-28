import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin, generateSessionToken } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const isValid = await verifyAdmin(username, password)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = generateSessionToken()

    const response = NextResponse.json({ success: true })
    response.cookies.set("admin-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
