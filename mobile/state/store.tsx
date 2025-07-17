import { getSelf } from '@/api';
import { fetchAPI } from '@/api/utils';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect } from 'react';
import { MMKV } from 'react-native-mmkv';
import { createStore, StoreApi, useStore } from 'zustand';
import { persist } from 'zustand/middleware';
import { Action, State, User, UserLocation } from './types';

const mmkv = new MMKV();

//

const DEFAULT_STATE: State = {
	user: null,
	locations: [],
	isTracking: false,
	lastSeenHistoryTabAt: null,
	lastLocationAt: null,
};

async function sendLocationsToServer(locations: UserLocation[]) {
	const response = await fetchAPI('api/locations', {
		method: 'POST',
		body: JSON.stringify(locations),
	}).catch((err) => {
		console.error('Failed to send locations to server', err);
	});

	if (response?.error) {
		console.error('Failed to send locations to server', response.error);
	}
}

async function main() {
	console.log('main. will send locations.');
	await new Promise((resolve) => setTimeout(resolve, 1000));
	const locations = mainStore.getState().locations;
	await sendLocationsToServer(locations);
}

void main();

//

export const mainStore = createStore<State & Action>()(
	persist(
		(set, get, store: StoreApi<State & Action>) => ({
			...DEFAULT_STATE,
			setUser: (user: User | null) => set({ user }),
			setIsTracking: (isTracking: boolean) => set({ isTracking }),
			setLastSeenHistoryTabAt: (lastSeenHistoryTabAt: string | null) => {
				set({ lastSeenHistoryTabAt });
			},
			addLocation: (location: UserLocation) => {
				set((state) => ({
					locations: [...state.locations, location],
					lastLocationAt: new Date().toISOString(),
				}));
			},
			removeLocation: (id: string) => {
				console.log('removeLocation', id);
				set((state) => ({
					locations: state.locations.filter((location) => location.id !== id),
				}));
			},
		}),
		{
			name: 'mmkv-storage',
			storage: {
				getItem: (name) => {
					const value = mmkv.getString(name);
					return value ? JSON.parse(value) : null;
				},
				setItem: (name, value) => {
					mmkv.set(name, JSON.stringify(value));
				},
				removeItem: (name) => {
					mmkv.delete(name);
				},
			},
		}
	)
);

export function useSelf() {
	const { user, setUser } = useMainStore();

	const {
		data: self,
		isLoading,
		error,
	} = useQuery<User>({
		queryKey: ['self'],
		queryFn: async () => {
			const user = await getSelf();
			return { ...user };
		},
		staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
		gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes (new name for cacheTime in v5)
		initialData: user || undefined, // Use cached data while loading, but handle null case
	});

	// Update Zustand store when new data arrives
	useEffect(() => {
		if (self) {
			setUser(self as User);
		}
	}, [self, setUser]);

	return { self, isLoading, error };
}

//
//
//
//
//
//

const StoreContext = createContext<StoreApi<State & Action> | null>(null);

export function useMainStore() {
	const mainStore = useContext(StoreContext)!;
	return useStore(mainStore, (state) => state);
}

export function StoreContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<StoreContext.Provider value={mainStore}>{children}</StoreContext.Provider>
	);
}
