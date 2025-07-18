import { logout } from '@/lib/auth'
import { redirect } from 'next/navigation'

export function LogoutButton() {
  async function handleLogout() {
    'use server'
    await logout()
    redirect('/login')
  }

  return (
    <form action={handleLogout}>
      <button
        type="submit"
        className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
      >
        Logout
      </button>
    </form>
  )
}
