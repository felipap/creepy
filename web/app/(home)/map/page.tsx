'use server'

import { db } from '@/db'
import { requireAuth } from '@/lib/auth'
import { LogoutButton } from '@/ui/LogoutButton'
import Link from 'next/link'
import { LocationMap } from './LocationMap'

export default async function Page() {
  await requireAuth()

  const locations = await getLocations()

  return (
    <div className="h-screen flex flex-col">
      <nav className="p-3 bg-amber-50 dark:bg-amber-950 flex justify-between items-center w-full">
        <div>
          <h1>Felipe&apos;s creepy tracking server</h1>
          <p>
            See{' '}
            <a href="https://github.com/felipap/tracker" className="text-link">
              GitHub
            </a>
          </p>
        </div>
        <div>
          <LogoutButton />
        </div>
      </nav>
      <main className="flex-1 h-full">
        <header className="flex justify-between items-center p-3 py-4 bg-amber-100 dark:bg-amber-900">
          <div className="flex flex-col gap-2">
            <Link href="/" className="text-sm hover:underline">
              &larr; See timeline
            </Link>
            <h1 className="text-[18px] font-semibold">Location history map</h1>
          </div>
        </header>
        <LocationMap locations={locations} />
      </main>
    </div>
  )
}

async function getLocations() {
  return await db.query.Locations.findMany()
}
