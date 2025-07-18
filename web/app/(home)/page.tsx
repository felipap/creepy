'use server'

import { db } from '@/db'
import { requireAuth } from '@/lib/auth'
import { LogoutButton } from '@/ui/LogoutButton'
import { Suspense } from 'react'
import { Item } from './LocationItem'

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
      <main className="flex-1 h-full bg-amber-100 dark:bg-amber-900">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-[17px] font-semibold">
            Locations ({locations.length})
          </h1>
        </div>
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
    </div>
  )
}

async function getLocations() {
  return await db.query.Locations.findMany()
}
