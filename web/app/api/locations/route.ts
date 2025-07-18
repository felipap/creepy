import { db } from '@/db'
import { DEFAULT_USER_ID, Locations } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { authMobileRequest } from '../lib'

export const GET = authMobileRequest(async (request: NextRequest) => {
  console.log('GET /locations')

  const page = request.nextUrl.searchParams.get('page') || '0'
  const limit = request.nextUrl.searchParams.get('limit') || '20'

  const locations = await db.query.Locations.findMany({
    where: eq(Locations.userId, DEFAULT_USER_ID),
    orderBy: desc(Locations.timestamp),
    limit: parseInt(limit),
    offset: parseInt(page) * parseInt(limit),
  })

  console.log('Found', locations.length, `locations`)

  return new Response(
    JSON.stringify({
      locations,
    }),
  )
})

const PostStruct = z.object({
  uniqueId: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  source: z.string(),
})

export const POST = authMobileRequest(async (request: NextRequest) => {
  console.log('POST /locations')

  const json = await request.json()

  const parsed = PostStruct.safeParse(json)
  if (!parsed.success) {
    console.warn('Invalid request body', { error: parsed.error })
    return Response.json({ error: parsed.error }, { status: 400 })
  }

  const [loc] = await db
    .insert(Locations)
    .values({
      userId: DEFAULT_USER_ID,
      uniqueId: parsed.data.uniqueId,
      latitude: '' + parsed.data.latitude,
      longitude: '' + parsed.data.longitude,
      source: parsed.data.source,
    })
    .returning()
    .onConflictDoNothing({
      target: [Locations.uniqueId, Locations.userId],
    })

  if (!loc) {
    console.log(`Location ${parsed.data.uniqueId} already exists, skipping.`)
    return Response.json(
      { error: 'Location already exists' },
      {
        status: 409,
      },
    )
  }

  console.info('Inserted 	location', loc)

  return Response.json({ location: loc })
})
