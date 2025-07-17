import { debug, log, warn } from '@/lib/logger';
import { z } from 'zod';
import { fetchAPI } from './utils';

const Struct = z.object({
	user: z.object({
		id: z.string(),
		email: z.string(),
		pushToken: z.string().nullable(),
	}),
});

export async function getSelf() {
	const result = await fetchAPI('api/self');

	if (result.error) {
		throw new Error(result.error);
	}

	const parsed = Struct.safeParse(result.data);
	if (!parsed.success) {
		warn('Unexpected response from /api/self', parsed.error);
	}

	return result.data.user;
}

export async function updateNotificationSettings(
	notificationsEnabled: boolean,
	pushToken: string | null
) {
	debug('[API] Updating notification settings', {
		notificationsEnabled,
		pushToken,
	});

	const result = await fetchAPI('api/self', {
		method: 'PATCH',
		body: JSON.stringify({ notificationsEnabled, pushToken }),
	});

	debug('[API] result', result);

	if (result.error) {
		throw new Error(result.error);
	}

	const parsed = Struct.safeParse(result.data);
	if (!parsed.success) {
		warn('Unexpected response from /api/self', parsed.error);
	}

	return result.data.user;
}
