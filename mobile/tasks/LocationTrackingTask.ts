import { debug, error, log, logError } from '@/lib/logger';
import { STORAGE_KEYS, writeLocalStorage } from '@/state';
import { mainStore } from '@/state/store';
import { UserLocation } from '@/state/types';
import * as ExpoLocation from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { sendLocationToApi } from '../api';
import { getLocationLabel } from './location-labels';

const MIN_TIME_LOCATION_TRACKING_INTERVAL = 20_000;
const TASK_NAME = 'location-tracking';

// Register the background task
TaskManager.defineTask(TASK_NAME, async ({ data, error: taskError }) => {
	// // Check if user is authenticated
	// const token = await getClerkToken();
	// if (!token) {
	// 	// log('[LOCATION] User not authenticated, skipping location update');
	// 	return;
	// }

	debug('[LOCATION] Background location update');

	if (taskError) {
		error('[LOCATION] Task Manager Error:', taskError.message);
		return;
	}

	try {
		if (data) {
			const { locations } = data as {
				locations: ExpoLocation.LocationObject[];
			};
			const location = locations[0];

			if (location) {
				await trySaveLocationToLocalStorage(location, 'background');
				await sendLocationToApi(location, 'background');
				await writeLocalStorage(STORAGE_KEYS.LAST_SENT, new Date());
			}
		}
	} catch (e) {
		error('[LOCATION] Error in background task:', e);
	}
});

export class LocationTrackingTask {
	static async isActive() {
		return await TaskManager.isTaskRegisteredAsync(TASK_NAME);
	}

	static async start() {
		log('[LOCATION] Starting');

		// Check if user is authenticated
		// const token = await getClerkToken();
		// if (!token) {
		// 	// log('[LOCATION] User not authenticated, cannot start location tracking');
		// 	return { subscription: null };
		// }

		try {
			// Request background permissions for continuous updates
			const { status: foregroundStatus } =
				await ExpoLocation.requestForegroundPermissionsAsync();
			const { status: backgroundStatus } =
				await ExpoLocation.requestBackgroundPermissionsAsync();

			if (foregroundStatus !== 'granted' || backgroundStatus !== 'granted') {
				throw new Error('Permission to access location was denied');
			}

			// Configure background tracking
			await ExpoLocation.startLocationUpdatesAsync(TASK_NAME, {
				accuracy: ExpoLocation.Accuracy.Balanced,
				timeInterval: MIN_TIME_LOCATION_TRACKING_INTERVAL,
				distanceInterval: 10, // minimum change (in meters) to trigger update
				foregroundService: {
					notificationTitle: 'Coach is tracking your location',
					notificationBody: 'This helps your AI coach understand your context',
				},
			});

			// Set up foreground location subscription
			const subscription = await ExpoLocation.watchPositionAsync(
				{
					accuracy: ExpoLocation.Accuracy.Highest,
					timeInterval: MIN_TIME_LOCATION_TRACKING_INTERVAL,
					distanceInterval: 10,
				},
				async (location) => {
					// Check authentication before sending location
					// const token = await getClerkToken();
					// if (!token) {
					// 	log('[LOCATION] User not authenticated, skipping location update');
					// 	return;
					// }

					console.log('location', location);

					await trySaveLocationToLocalStorage(location, 'foreground');
					await sendLocationToApi(location, 'foreground');
					await writeLocalStorage(STORAGE_KEYS.LAST_SENT, new Date());
				}
			);

			return { subscription };
		} catch (e) {
			logError('[LOCATION] Error starting location tracking:', e);
			throw e;
		}
	}

	static async stop() {
		if (!(await this.isActive())) {
			return;
		}

		try {
			// Stop background tracking
			await ExpoLocation.stopLocationUpdatesAsync(TASK_NAME);
		} catch (e) {
			logError('[LOCATION] Error stopping location tracking:', e);
			throw e;
		}
	}
}

export async function trySaveLocationToLocalStorage(
	location: ExpoLocation.LocationObject,
	source: 'background' | 'button' | 'foreground'
) {
	const label = getLocationLabel(location.coords);

	try {
		const loc: UserLocation = {
			id: String(Math.floor(Math.random() * 1000000)),
			timestamp: new Date().toISOString(),
			latitude: location.coords.latitude,
			longitude: location.coords.longitude,
			source,
			label,
		};
		mainStore.getState().addLocation(loc);
		console.log('Location saved to local storage');
	} catch (e) {
		logError('[LOCATION] Error adding location:', e);
	}
}
