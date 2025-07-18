'use server'

import { db } from '@/db'
import { requireAuth } from '@/lib/auth'
import Link from 'next/link'
import { Suspense } from 'react'
import { Item } from './LocationItem'

export default async function Page() {
  await requireAuth()

  const locations = await getLocations()

  return (
    <main className="flex-1 h-full bg-amber-100 dark:bg-amber-900">
      <header className="flex justify-between items-center p-3 py-4 bg-amber-100 dark:bg-amber-900">
        <div className="flex flex-col gap-2">
          <Link href="/map" className="text-sm hover:underline">
            See map &rarr;
          </Link>
          <h1 className="text-[18px] font-semibold">
            Location timeline ({Number(locations.length).toLocaleString()})
          </h1>
        </div>
      </header>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-col gap-4 p-4  overflow-scroll h-full bg-white dark:bg-black">
          <ul className="list-disc list-inside">
            {locations.map(location => (
              <Item key={location.id} location={location} />
            ))}
          </ul>
        </div>
      </Suspense>
    </main>
  )
}

async function getLocations() {
  return await db.query.Locations.findMany()
}
