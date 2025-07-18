import { db } from '@/db'
import { DEFAULT_USER_ID, Locations } from '@/db/schema'
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { authMobileRequest, CreateLocationStruct } from '../route'

const PostStruct = z.object({
  locations: z.array(CreateLocationStruct),
})

/**
 * Only the new locations are returned.
 */
export const POST = authMobileRequest(async (request: NextRequest) => {
  const json = await request.json()

  const parsed = PostStruct.safeParse(json)
  if (!parsed.success) {
    return Response.json({ error: parsed.error }, { status: 400 })
  }

  const locations = parsed.data.locations

  console.log('POST /locations/batch', locations)

  const dbLocations = await db
    .insert(Locations)
    .values(
      locations.map(l => ({
        ...l,
        userId: DEFAULT_USER_ID,
        latitude: l.latitude.toString(),
        longitude: l.longitude.toString(),
      })),
    )
    .onConflictDoNothing()
    .returning()

  // QUESTION what happens if a subset conflicts??

  return Response.json({ locations: dbLocations })
})
