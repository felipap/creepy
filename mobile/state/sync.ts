import { fetchAPI } from '@/api/utils';
import { mainStore } from './store';
import { UserLocation } from './types';

export async function syncAllLocations() {
	const all = mainStore.getState().locations;
	console.log('Total locations to sync', all.length);

	const nonSynced = all.filter((location) => !location.remoteId);
	console.log(`Non-synced locations ${nonSynced.length}/${all.length}`);

	const locationIdToRemoteId = await syncLocations(nonSynced);

	// try-catch?
	console.log(`Saving remote IDs for ${locationIdToRemoteId.length} locations`);
	mainStore.getState().setLocationsRemoteIds(locationIdToRemoteId);

	// for (const location of nonSynced) {
	// 	if (location.remoteId) {
	// 		console.log('Location already synced', location.remoteId);
	// 		continue;
	// 	}

	// 	console.log('Location not synced', location.id);
	// }
}

async function syncLocations(
	locations: UserLocation[],
	chunkSize = 50
): Promise<{ id: string; remoteId: string }[]> {
	const chunks = chunk(locations, chunkSize);

	const idToRemoteId: { id: string; remoteId: string }[] = [];

	for (const [index, chunk] of chunks.entries()) {
		console.log(`Syncing chunk ${index + 1}/${chunks.length}`);
		const chunkIdToRemoteId = await syncLocationChunk(chunk);

		for (const [id, remoteId] of Object.entries(chunkIdToRemoteId)) {
			idToRemoteId.push({ id, remoteId });
		}

		console.log('Synced chunk.');
	}

	return idToRemoteId.map((l) => ({ id: l.id, remoteId: l.remoteId }));
}

async function syncLocationChunk(
	chunk: UserLocation[]
): Promise<Record<string, string>> {
	const res = await fetchAPI('api/locations/batch', {
		method: 'POST',
		body: JSON.stringify({
			locations: chunk.map((l) => ({
				uniqueId: l.id,
				latitude: l.latitude,
				longitude: l.longitude,
				source: l.source,
				label: l.label,
			})),
		}),
	});

	if ('error' in res) {
		console.log('chunk', chunk);
		console.error('Failed to sync chunk', res.error);
		throw Error('fuck');
	}

	console.log('Synced chunk', chunk.length);

	const idToRemoteId: Record<string, string> = {};
	for (const location of res.data.locations) {
		idToRemoteId[location.uniqueId] = location.id;
	}

	return idToRemoteId;
}

function chunk<T>(array: T[], size: number): T[][] {
	const result: T[][] = [];
	for (let i = 0; i < array.length; i += size) {
		result.push(array.slice(i, i + size));
	}
	return result;
}
