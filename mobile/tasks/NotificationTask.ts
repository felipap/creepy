import { getClerkToken } from '@/lib/clerk';
import { debug, error, log, logError, warn } from '@/lib/logger';
import { mainStore } from '@/state/store';
import * as BackgroundFetch from 'expo-background-fetch';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { AppState, AppStateStatus } from 'react-native';

const NAME = 'BACKGROUND_NOTIFICATION_TASK';

// Track app state
let currentAppState: AppStateStatus = AppState.currentState;
AppState.addEventListener('change', (nextAppState) => {
	currentAppState = nextAppState;
});

Notifications.setNotificationHandler({
	handleNotification: async () => {
		// Don't show notifications when app is active
		const shouldShowAlert = currentAppState !== 'active';
		debug('shouldShowAlert', shouldShowAlert);

		return {
			shouldShowAlert,
			shouldPlaySound: shouldShowAlert,
			shouldSetBadge: false,
			shouldShowBanner: false,
			shouldShowList: false,
		};
	},
});

TaskManager.defineTask(NAME, async () => {
	try {
		// Check if user is authenticated
		const token = await getClerkToken();
		if (!token) {
			log('[NOTIFS] User not authenticated, skipping notification check');
			return BackgroundFetch.BackgroundFetchResult.NoData;
		}

		const count = await runNotificationCheck();
		if (count > 0) {
			return BackgroundFetch.BackgroundFetchResult.NewData;
		}
		return BackgroundFetch.BackgroundFetchResult.NoData;
	} catch (err) {
		logError('[NOTIFS] Error checking for notifications:', err);
		return BackgroundFetch.BackgroundFetchResult.Failed;
	}
});

export class NotificationTask {
	static async registerForPushNotifications() {
		try {
			// Check if we have permission
			const { status: existingStatus } =
				await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;

			if (existingStatus !== 'granted') {
				// Request permission
				const { status } = await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}
			debug('[NOTIFS] Permission status:', finalStatus);

			if (finalStatus !== 'granted') {
				warn('[NOTIFS] Permission not granted');
				return null;
			}

			// Get the token
			const { data: pushTokenString } =
				await Notifications.getExpoPushTokenAsync({
					projectId: Constants.expoConfig?.extra?.eas?.projectId,
				});

			if (!pushTokenString) {
				error('[NOTIFS] Failed to get push token');
				return null;
			}

			// Update user state and server
			await mainStore.getState().updatePushToken(pushTokenString);

			return pushTokenString;
		} catch (err) {
			logError('[NOTIFS] Error registering for push notifications:', err);
			return null;
		}
	}

	static async start() {
		// Check if user is authenticated
		const token = await getClerkToken();
		if (!token) {
			log('[NOTIFS] User not ! authenticated, skipping push start');
			return false;
		}

		// Register for pushs and get token
		const pushToken = await this.registerForPushNotifications();
		if (!pushToken) {
			error('[NOTIFS] Failed to get push token');
			return false;
		}

		log('[NOTIFS] Push notifications started successfully');
		return true;
	}

	static async stop() {
		// Nothing to stop for pushs
		// The system handles everything automatically
		return;
	}

	static async isRegistered() {
		const { status } = await Notifications.getPermissionsAsync();
		return status === 'granted';
	}
}

//
//
//

async function runNotificationCheck() {
	// Not sure we'll ever use this
	return 0;
}
