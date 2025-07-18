import { getLocationLabel } from '@/lib/location-labels'
import { logError } from '@/lib/logger'
import { mainStore } from './store'
import { UserLocation } from './types'

export * from './storage-hooks'
export * from './sync'

export enum STORAGE_KEYS {
  LAST_SENT = 'lastSent',
  ERROR_MSG = 'errorMsg',
  TRACKING_ERROR_MSG = 'trackingErrorMsg',
  IS_TRACKING = 'isTracking',
  LAST_NOTIFICATION_CHECK = 'lastNotificationCheck',
  SHOW_RAW_MESSAGES = 'showRawMessages',
  SHOW_INTERNAL_MESSAGES = 'showInternalMessages',
}

export async function trySaveLocationToLocalStorage(
  input: {
    timestamp: Date
    latitude: number
    longitude: number
    accuracy: number | null
  },
  source: 'background' | 'button' | 'foreground',
): Promise<UserLocation | null> {
  const label = getLocationLabel(input.latitude, input.longitude)
  const id = String(Math.floor(Math.random() * 1000000))

  const loc: UserLocation = {
    uniqueId: id,
    timestamp: input.timestamp.toISOString(),
    accuracy: input.accuracy,
    latitude: input.latitude,
    longitude: input.longitude,
    source,
    label,
    // Will be filled after sync.
    remoteId: null,
    remoteSyncedAt: null,
  }

  try {
    mainStore.getState().addLocation(loc)
    console.log('[state] Location saved to local storage')
    return loc
  } catch (e) {
    logError('[state] Error adding location', { error: e, location: loc })
    return null
  }
}
