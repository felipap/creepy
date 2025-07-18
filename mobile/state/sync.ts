import { fetchAPI } from '@/api/utils'
import { mainStore } from './store'
import { UserLocation } from './types'

// For now, we'll attempt to sync once per app start, after a short delay.
let hasStartedSyncing = false
export async function startSyncLogic() {
  console.info('[state/sync] starting')

  if (hasStartedSyncing) {
    return
  }
  hasStartedSyncing = true

  setTimeout(async () => {
    try {
      await syncAllPendingLocations()
    } catch (e) {
      console.error('[state/sync] syncAllPendingLocations FAILED', e)
    }
  }, 10_000)
}

export async function syncAllPendingLocations() {
  const all = mainStore.getState().locations
  console.log('Total locations to sync', all.length)

  const nonSynced = all.filter((location) => !location.remoteId)
  console.log(`Non-synced locations ${nonSynced.length}/${all.length}`)

  let locIdToRemoteId
  try {
    locIdToRemoteId = await syncLocations(nonSynced)
  } catch (e) {
    console.error('[state/sync] syncLocations FAILED', e)
    return
  }

  console.log(`Saving remote IDs for ${locIdToRemoteId.length} locations`)
  try {
    mainStore.getState().setLocationsRemoteIds(locIdToRemoteId)
  } catch (e) {
    console.error('[state/sync] setLocationsRemoteIds FAILED', e)
  }
}

async function syncLocations(
  locations: UserLocation[],
  chunkSize = 50,
): Promise<{ id: string; remoteId: string }[]> {
  const chunks = chunk(locations, chunkSize)
  const idToRemoteId: { id: string; remoteId: string }[] = []
  for (const [index, chunk] of chunks.entries()) {
    console.debug(`Syncing chunk ${index + 1}/${chunks.length}`)
    const chunkIdToRemoteId = await syncLocationChunk(chunk)

    for (const [id, remoteId] of Object.entries(chunkIdToRemoteId)) {
      idToRemoteId.push({ id, remoteId })
    }

    console.debug('Synced chunk.')
  }
  return idToRemoteId.map((l) => ({ id: l.id, remoteId: l.remoteId }))
}

async function syncLocationChunk(
  chunk: UserLocation[],
): Promise<Record<string, string>> {
  const res = await fetchAPI('api/locations/batch', {
    method: 'POST',
    body: JSON.stringify({
      locations: chunk.map((l) => ({
        uniqueId: l.uniqueId,
        timestamp: new Date(l.timestamp).getTime(),
        latitude: l.latitude,
        longitude: l.longitude,
        source: l.source,
        label: l.label,
      })),
    }),
  })

  if ('error' in res) {
    console.log('chunk', chunk)
    console.error('[state/sync] API failed at api/locations/batch', res.error)
    throw Error(
      `Failed to sync chunk error=${res.error} message=${res.message}`,
    )
  }

  // Collect a translation of uniqueId to remoteId.
  const idToRemoteId: Record<string, string> = {}
  for (const location of res.data.locations) {
    idToRemoteId[location.uniqueId] = location.id
  }
  return idToRemoteId
}

function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}
