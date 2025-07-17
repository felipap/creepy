import { z } from 'zod';
import { fetchAPI } from './utils';
import { debug, warn } from '@/lib/logger';

const ActivityStruct = z.object({
	id: z.string(),
	label: z.string(),
	emoji: z.string(),
});

export type Activity = z.infer<typeof ActivityStruct>;

const EventStruct = z.object({
	id: z.string(),
	activity: ActivityStruct,
	startedAt: z.string(),
	endedAt: z.string().nullable(),
});

export type Event = z.infer<typeof EventStruct>;

//
//
//

export async function fetchActivities() {
	debug('Fetching activities');
	const { data, error } = await fetchAPI('/api/activities');

	if (error) {
		warn('[api] Failed to fetch activities', error);
		throw Error('Failed to fetch activity');
	}

	return data.activities;
}

export async function fetchCurrentEvent(): Promise<Event | null> {
	debug('Fetching current event');

	const { data, error } = await fetchAPI('/api/events/current');
	if (error) {
		warn('[api] Failed to fetch current event', error);
		throw Error('Failed to fetch current event');
	}
	debug('Returning current event', data.event);

	return data.event;
}

export async function createCurrentEvent(activity: Activity) {
	const { data, error } = await fetchAPI('/api/events', {
		method: 'POST',
		body: JSON.stringify({
			activityId: activity.id,
			startedAt: new Date().toISOString(),
		}),
	});

	if (error) {
		warn('[api] Failed to create current event', error);
		throw Error('Failed to create current event');
	}

	return data.event;
}

export async function endCurrentEvent() {
	const currentEvent = await fetchCurrentEvent();
	if (!currentEvent) {
		throw Error('No current event found');
	}

	debug('Ending current event', currentEvent);

	const { data, error } = await fetchAPI(`/api/events/${currentEvent.id}`, {
		method: 'PUT',
		body: JSON.stringify({
			endedAt: new Date().toISOString(),
		}),
	});

	if (error) {
		warn('[api] Failed to end current event', error);
		throw Error('Failed to end current event');
	}

	return data.event;
}
