import bcrypt from "bcryptjs"
import { createClient } from "@/lib/supabase"

export interface AdminUser {
  id: string
  username: string
}

export async function authenticateAdmin(username: string, password: string): Promise<AdminUser | null> {
  const supabase = createClient()

  const { data: user, error } = await supabase.from("admin_users").select("*").eq("username", username).single()

  if (error || !user) {
    return null
  }

  const isValid = await bcrypt.compare(password, user.password_hash)
  if (!isValid) {
    return null
  }

  return {
    id: user.id,
    username: user.username,
  }
}

export function setAdminSession(user: AdminUser) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("admin_user", JSON.stringify(user))
  }
}

export function getAdminSession(): AdminUser | null {
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem("admin_user")
    return stored ? JSON.parse(stored) : null
  }
  return null
}

export function clearAdminSession() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("admin_user")
  }
}
