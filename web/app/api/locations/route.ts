import { db } from '@/db';
import { Locations } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getUser } from '../../../lib/session';

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

const PostStruct = z.object({
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180),
	source: z.string(),
});

export async function POST(request: Request) {
	console.log('POST /locations');

	const user = await getUser();

	const json = await request.json();

	const location = PostStruct.safeParse(json);
	if (!location.success) {
		return new Response(JSON.stringify({ error: location.error }), {
			status: 400,
		});
	}

	await db.insert(Locations).values({
		userId: user.id,
		latitude: location.data.latitude,
		longitude: location.data.longitude,
		source: location.data.source,
	});

	return new Response(
		JSON.stringify({
			message: 'Hello, world!',
		})
	);
}
