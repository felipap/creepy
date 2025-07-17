import { db } from '@/db';
import { Locations } from '@/db/schema';
import { getLocationLabel } from '@/lib/location-labels';
import { desc, eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getMobileUser, getUser } from '../../../lib/session';

const MIN_INTERVAL = 1000 * 5;

export async function GET(request: NextRequest) {
	const user = await getUser();

	const page = request.nextUrl.searchParams.get('page') || '0';
	const limit = request.nextUrl.searchParams.get('limit') || '20';

	const locations = await db.query.Locations.findMany({
		where: eq(Locations.userId, user.id),
		orderBy: desc(Locations.timestamp),
		limit: parseInt(limit),
		offset: parseInt(page) * parseInt(limit),
	});

	console.log('Found', locations.length, `locations`);

	return new Response(
		JSON.stringify({
			locations,
		})
	);
}

async function getLatestLocationTimestamp(userId: number) {
	const location = await db.query.Locations.findFirst({
		where: eq(Locations.userId, userId),
		orderBy: desc(Locations.timestamp),
	});

	return location?.timestamp || null;
}

const Struct = z.object({
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180),
	source: z.string(),
});

export async function POST(request: Request) {
	const user = await getMobileUser(request);
	const body = await request.json();

	if (process.env.NODE_ENV === 'development') {
		// Play a sound when a location is sent in development
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		require('child_process').exec(
			'afplay /System/Library/Sounds/Pop.aiff -v 10'
		);
	}

	let parsed;
	try {
		parsed = Struct.parse(body);
	} catch (error: any) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 400,
		});
	}

	const label = getLocationLabel({
		latitude: parsed.latitude,
		longitude: parsed.longitude,
	});

	console.log('Felipe is at', label);

	const latest = await getLatestLocationTimestamp(user.id);
	if (latest && latest.getTime() > Date.now() - MIN_INTERVAL) {
		console.log('Last location was sent too recently.');
		return new Response(JSON.stringify({ error: 'Too frequent' }), {
			status: 429,
		});
	}

	const location = await db
		.insert(Locations)
		.values({
			userId: user.id,
			timestamp: new Date(),
			latitude: '' + parsed.latitude,
			longitude: '' + parsed.longitude,
			source: parsed.source,
			placeLabel: label,
		})
		.returning();

	return new Response(JSON.stringify(location));
}
