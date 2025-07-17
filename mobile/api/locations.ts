import { log, logger } from '@/lib/logger';
import * as ExpoLocation from 'expo-location';
import { fetchAPI } from './utils';

export async function sendLocationToApi(
	location: ExpoLocation.LocationObject,
	source: 'button' | 'background' | 'foreground'
) {
	log('sending location to new endpoint');

	const result = await fetchAPI('api/locations', {
		method: 'POST',
		body: JSON.stringify({
			latitude: location.coords.latitude,
			longitude: location.coords.longitude,
			accuracy: location.coords.accuracy,
			timestamp: location.timestamp,
			source,
		}),
	});

	if (result.error) {
		logger.error('Failed to send location:', result.error);
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
	const result = await fetchAPI(`api/locations?page=${page}&limit=${limit}`);

	if (result.error) {
		throw new Error(result.error);
	}

	return result.data.locations;
}
