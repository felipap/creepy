import { STORAGE_KEYS, useLocalStorage } from '@/state'
import { useMainStore } from '@/state/store'
import { LocationTrackingTask } from '@/tasks/location'
import * as Location from 'expo-location'
import { useContext, useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { LocationContext } from './hook'

export const TrackerProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { isTracking, setIsTracking } = useMainStore()
  const [lastSent, setLastSent] = useLocalStorage<string | null>(
    STORAGE_KEYS.LAST_SENT,
    null,
  )
  const [errorMsg, setErrorMsg] = useLocalStorage<string | null>(
    STORAGE_KEYS.ERROR_MSG,
    null,
  )
  const [locationSubscription, setLocationSubscription] =
    useState<Location.LocationSubscription | null>(null)

  const startTracking = async () => {
    try {
      const isRunning = await LocationTrackingTask.isActive()
      if (isRunning) {
        setIsTracking(true)
        setErrorMsg(null)
        return
      } else {
      }

      try {
        const { subscription } = await LocationTrackingTask.start()
        setLocationSubscription(subscription)
        setIsTracking(true)
        setErrorMsg(null)
      } catch (err) {
        setErrorMsg(`Error starting tracking: ${err.message}`)
        setIsTracking(false)
      }
    } catch (err) {
      setErrorMsg(`Error starting tracking: ${err.message}`)
      setIsTracking(false)
    }
  }

  const stopTracking = async () => {
    try {
      // Clean up location subscription
      if (locationSubscription) {
        locationSubscription.remove()
        setLocationSubscription(null)
      }

      await LocationTrackingTask.stop()

      setIsTracking(false)
    } catch (error) {
      setErrorMsg(`Error stopping tracking: ${error.message}`)
    }
  }

  useEffect(() => {
    // Toast.show({
    // 	type: 'success',
    // 	text1: 'background',
    // });

    async function load() {
      const isActive = await LocationTrackingTask.isActive()
      console.log('Tracking isActive? =', isActive)
      setIsTracking(isActive)

      if (isActive) {
        startTracking()
      }
    }

    load()

    // Cleanup on component unmount
    return () => {
      // console.log('component is unmounting');
      return
      // console.log('cleaning up');
      //
      // if (locationSubscription) {
      // 	locationSubscription.remove();
      // }
      // Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME).then(
      // 	(hasStarted) => {
      // 		if (hasStarted) {
      // 			Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      // 		}
      // 	}
      // );
    }
  }, [])

  return (
    <LocationContext.Provider
      value={{
        location: null,
        error: null,
        lastSent: lastSent ? new Date(lastSent) : null,
        isTracking,
        startTracking,
        errorMsg,
        stopTracking,
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  statusText: {
    color: 'black',
  },
})

export function useLocationTrackingContext() {
  return useContext(LocationContext)
}
