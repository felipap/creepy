'use server'

import { db } from '@/db'
import { logout, requireAuth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { Item } from './LocationItem'

export default async function Page() {
  await requireAuth()

  const locations = await getLocations()

  console.log('locations', locations)

  return (
    <div className="p-4">
      <div className="p-3">
        <h1>Felipe&apos;s tracking server.</h1>
        <p>
          <a href="https://github.com/felipap/tracker" className="text-link">
            GitHub
          </a>
        </p>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[17px] font-semibold">
          Locations ({locations.length})
        </h1>
        <LogoutButton />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-col gap-4">
          <ul className="list-disc list-inside">
            {locations.map(location => (
              <Item key={location.id} location={location} />
            ))}
          </ul>
        </div>
      </Suspense>
    </div>
  )
}

function LogoutButton() {
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

async function getLocations() {
  return await db.query.Locations.findMany()
}
