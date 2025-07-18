import { authMobileRequest } from '@/app/api/lib'
import { db } from '@/db'
import { DEFAULT_USER_ID, Locations } from '@/db/schema'
import { NextRequest } from 'next/server'
import { z } from 'zod'

const PostStruct = z.object({
  locations: z
    .array(
      z.object({
        uniqueId: z.string(),
        timestamp: z.number(),
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        source: z.string(),
      }),
    )
    .max(50, 'Exceeded max locations = 50'),
})

/**
 * Old locations are returned too, only because the mobile app needs to get
 * their IDs.
 */
export const POST = authMobileRequest(async (request: NextRequest) => {
  console.log('POST /api/locations/batch')

  const json = await request.json()

  const parsed = PostStruct.safeParse(json)
  if (!parsed.success) {
    console.debug('Invalid request body', {
      json,
      error: parsed.error,
    })
    return Response.json({ error: parsed.error }, { status: 400 })
  }

  const createdAt = new Date()

  const dbLocations = await db
    .insert(Locations)
    .values(
      parsed.data.locations.map(l => ({
        uniqueId: l.uniqueId,
        userId: DEFAULT_USER_ID,
        createdAt,
        timestamp: new Date(l.timestamp),
        latitude: l.latitude.toString(),
        longitude: l.longitude.toString(),
        source: l.source,
      })),
    )
    // We need to update in order to get the objects back, because the caller
    // will need their IDs to consider them synced.
    .onConflictDoUpdate({
      target: [Locations.uniqueId, Locations.userId],
      set: {
        // We need to update in order to get the already-existing locations
        // back, but we can't have an empty update. So we just set this,
        // whatever.
        uselessField: 'whatever',
      },
    })
    .returning()

  const countNewEntries = dbLocations.filter(
    l => l.createdAt.getTime() === createdAt.getTime(),
  ).length

  console.log(
    `Created ${countNewEntries}/${parsed.data.locations.length} new entries`,
  )

  return Response.json({ locations: dbLocations })
})
