export const ADMIN_CREDENTIALS = {
  username: "Seunish",
  password: "YTREWQ$321",
}

export interface AdminUser {
  username: string
}

export function validateAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}

export async function authenticateAdmin(username: string, password: string): Promise<AdminUser | null> {
  // Development fallback - always allow these credentials
  if (validateAdminCredentials(username, password)) {
    return { username: "Seunish" }
  }

  // In production, you would check against the database
  // For now, we'll just use the fallback
  return null
}

export function getAdminSession(): AdminUser | null {
  if (typeof window === "undefined") return null

  const session = sessionStorage.getItem("admin_auth")
  if (session) {
    return JSON.parse(session)
  }
  return null
}

export function setAdminSession(user: AdminUser): void {
  if (typeof window === "undefined") return

  sessionStorage.setItem("admin_auth", JSON.stringify(user))
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return

  sessionStorage.removeItem("admin_auth")
}
