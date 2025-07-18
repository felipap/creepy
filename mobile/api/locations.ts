import { log, logger } from '@/lib/logger';
import * as ExpoLocation from 'expo-location';
import { fetchAPI } from './utils';

export async function sendLocationToApi(
	location: ExpoLocation.LocationObject,
	source: 'button' | 'background' | 'foreground'
) {
	log('sending location to new endpoint');

	const res = await fetchAPI('api/locations', {
		method: 'POST',
		body: JSON.stringify({
			latitude: location.coords.latitude,
			longitude: location.coords.longitude,
			accuracy: location.coords.accuracy,
			timestamp: location.timestamp,
			source,
		}),
	});

	if ('error' in res) {
		logger.error('Failed to send location:', res.error);
		return;
	}

	log(`Location sent successfully`);
}

export type Location = {
	id: string;
	latitude: string;
	longitude: string;
	accuracy?: number;
	timestamp: number;
	source: 'button' | 'background' | 'foreground';
};

export async function getHistory(
	page: number,
	limit: number
): Promise<Location[]> {
	const res = await fetchAPI(`api/locations?page=${page}&limit=${limit}`);

	if ('error' in res) {
		throw new Error(res.error);
	}

	return res.data.locations;
}
