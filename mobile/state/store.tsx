import { createContext, useContext } from 'react'
import { MMKV } from 'react-native-mmkv'
import { createStore, StoreApi, useStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { Action, DEFAULT_STATE, State, UserLocation } from './types'

const mmkv = new MMKV()

export const mainStore = createStore<State & Action>()(
  persist(
    (set, get, store: StoreApi<State & Action>) => ({
      ...DEFAULT_STATE,
      setIsTracking: (isTracking: boolean) => set({ isTracking }),
      setLastSeenHistoryTabAt: (lastSeenHistoryTabAt: string | null) => {
        set({ lastSeenHistoryTabAt })
      },
      addLocation: (location: UserLocation) => {
        set((state) => ({
          locations: [...state.locations, location],
          lastLocationAt: new Date().toISOString(),
        }))
      },
      setLocationsRemoteIds: (
        locationIdToRemoteId: { id: string; remoteId: string }[],
      ) => {
        set((state) => {
          const idToRemoteId = Object.fromEntries(
            locationIdToRemoteId.map((l) => [l.id, l.remoteId]),
          )

          return {
            locations: state.locations.map((l) =>
              idToRemoteId[l.uniqueId]
                ? {
                    ...l,
                    remoteId: idToRemoteId[l.uniqueId],
                    remoteSyncedAt: new Date().toISOString(),
                  }
                : l,
            ),
          }
        })
      },
      // changeLocationId: (location: UserLocation, newId: string) => {
      // 	set((state) => {
      // 		return {
      // 			locations: newLocations,
      // 		};
      // 	});
      // },
      removeLocation: (id: string) => {
        set((state) => ({
          locations: state.locations.filter(
            (location) => location.uniqueId !== id,
          ),
        }))
      },
    }),
    {
      name: 'mmkv-storage',
      storage: {
        getItem: (name) => {
          const value = mmkv.getString(name)
          return value ? JSON.parse(value) : null
        },
        setItem: (name, value) => {
          mmkv.set(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          mmkv.delete(name)
        },
      },
    },
  ),
)

//
//
//
//
//
//

const StoreContext = createContext<StoreApi<State & Action> | null>(null)

export function useMainStore() {
  const mainStore = useContext(StoreContext)!
  return useStore(mainStore, (state) => state)
}

export function StoreContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StoreContext.Provider value={mainStore}>{children}</StoreContext.Provider>
  )
}
