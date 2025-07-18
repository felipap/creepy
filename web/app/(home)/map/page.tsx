'use server'

import { db } from '@/db'
import { requireAuth } from '@/lib/auth'
import Link from 'next/link'
import { LocationMap } from './LocationMap'

export default async function Page() {
  await requireAuth()

  const locations = await getLocations()

  return (
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
  )
}

async function getLocations() {
  return await db.query.Locations.findMany()
}
