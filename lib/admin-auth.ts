import bcrypt from "bcryptjs"

const ADMIN_USERNAME = "Seunish"
const ADMIN_PASSWORD_HASH = "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" // YTREWQ$321

export async function verifyAdmin(username: string, password: string): Promise<boolean> {
  if (username !== ADMIN_USERNAME) {
    return false
  }

  return await bcrypt.compare(password, ADMIN_PASSWORD_HASH)
}

export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
