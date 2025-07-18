'use server'

import { db } from '@/db'
import { Suspense } from 'react'
import { Item } from './LocationItem'

export default async function Page() {
  const locations = await getLocations()

  console.log('locations', locations)

  return (
    <div className="p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-col gap-4">
          <h1 className="text-[17px] font-semibold">
            Locations ({locations.length})
          </h1>
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

async function getLocations() {
  return await db.query.Locations.findMany()
}
