import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const AUTH_COOKIE_NAME = 'tracker-auth'
const AUTH_COOKIE_VALUE = 'authenticated'

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME)
  return authCookie?.value === AUTH_COOKIE_VALUE
}

export async function requireAuth(): Promise<void> {
  if (!(await isAuthenticated())) {
    redirect('/login')
  }
}

export async function authenticate(password: string): Promise<boolean> {
  const expectedPassword = process.env.WEBSITE_SECRET

  if (!expectedPassword) {
    console.error('WEBSITE_SECRET environment variable not set')
    return false
  }

  if (password === expectedPassword) {
    const cookieStore = await cookies()
    cookieStore.set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return true
  }

  return false
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}
