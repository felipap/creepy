import { log, logError } from '@/lib/logger'
import { UserLocation } from '@/state/types'
import assert from 'assert'
import { fetchAPI } from './utils'

export async function syncLocation(location: UserLocation) {
  log('sending location to new endpoint')

  assert(location.uniqueId, 'uniqueId is required')
  assert(location.latitude, 'latitude is required')
  assert(location.longitude, 'longitude is required')
  assert(location.accuracy, 'accuracy is required')
  assert(location.timestamp, 'timestamp is required')
  assert(location.source, 'source is required')

  const body = {
    uniqueId: location.uniqueId,
    latitude: location.latitude,
    longitude: location.longitude,
    accuracy: location.accuracy,
    timestamp: new Date(location.timestamp).getTime(),
    source: location.source,
  }
  const res = await fetchAPI('api/locations', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  if ('error' in res) {
    logError('[api/locations] Failed to send location', {
      error: res.error,
      body,
    })
    return
  }

  log(`[api/locations] synced location ${location.uniqueId}`)
}

export type ApiLocation = {
  id: string
  createdAt: string
  uniqueId: string
  latitude: string
  longitude: string
  timestamp: number
  accuracy: number | null
  source: 'button' | 'background' | 'foreground'
}

export async function getLocationPage(
  page: number,
  limit: number,
): Promise<ApiLocation[]> {
  const res = await fetchAPI(`api/locations?page=${page}&limit=${limit}`)

  if ('error' in res) {
    throw new Error(res.error)
  }

  return res.data.locations
}
