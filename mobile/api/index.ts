import { debug, logger } from '@/lib/logger';
import { fetchAPI } from './utils';

export * from './activities';
export * from './locations';
export * from './user';

type Notification = {
	id: string;
	chatId: string;
	content: string;
	createdAt: string;
};

export async function sendPushTokenToServer(
	pushToken: string | null
): Promise<void> {
	debug('[api] Sending push token to server');

	const { error } = await fetchAPI('api/push-token', {
		method: 'POST',
		body: JSON.stringify({ pushToken }),
	});

	if (error) {
		logger.error('[api] Failed to send push token:', error);
		throw new Error('Failed to send push token');
	}

	debug('[api] Push token sent successfully');
}

export async function checkForNotifications(
	since: Date
): Promise<Notification[]> {
	debug('checking for notifications');

	const sinceISOString = since.toISOString();
	const { data, error } = await fetchAPI(
		`api/notifications?since=${sinceISOString}`
	);
	if (error) {
		logger.error('Error checking for notifications:', error);
		return [];
	}

	// Parse the response data
	return data?.notifications || [];
}
