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
        className="px-3 py-1 text-sm bg-yellow-50 hover:bg-gray-300 text-black sdark:bg-gray-800 sdark:hover:bg-gray-700 rounded-md transition-colors"
      >
        Logout
      </button>
    </form>
  )
}
