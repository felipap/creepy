import 'server-only';

import { db } from '@/db';
import { DeviceAuthRequest, User, Users } from '@/db/schema';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import assert from 'assert';
import { eq } from 'drizzle-orm';
import jsonwebtoken from 'jsonwebtoken';
import { headers } from 'next/headers';
import { unauthorized } from 'next/navigation';
import { cache } from 'react';
import { debug, error, warn } from './logger';

export const JWT_SECRET = process.env.JWT_SECRET || '';
if (!JWT_SECRET) {
	throw new Error('JWT_SECRET is not set');
}

export { clerkClient };

// IDK... i think of something like this might be necessary
function isUserStartedRequest(headers: Headers) {
	return true;
}

const getClerkSessionUser = cache(async (): Promise<User | null> => {
	const clerkUser = await currentUser();
	if (!clerkUser) {
		warn('No Clerk session found');
		return null;
	}

	const clerkEmail = clerkUser.emailAddresses[0]?.emailAddress;
	if (!clerkEmail) {
		warn('No Clerk email found');
		unauthorized();
	}

	const user = await db.query.Users.findFirst({
		where: eq(Users.email, clerkEmail),
	});
	if (!user) {
		debug(`No user found with email ${clerkEmail}`);
		unauthorized();
	}

	if (isUserStartedRequest(await headers())) {
		debug('Updating user last seen at');
		await db
			.update(Users)
			.set({
				clerkUserId: clerkUser.id,
				lastSeenAt: new Date(),
			})
			.where(eq(Users.id, user.id));
	}

	return user;
});

const getDesktopSessionUser = cache(async () => {
	const hs = await headers();
	const isReqFromDevice = !!hs.get('x-device-id');
	if (!isReqFromDevice) {
		return null;
	}

	const authorizatin = hs.get('authorization');
	if (!authorizatin) {
		return null;
	}

	const bearer = authorizatin.split(' ')[1];

	let decoded;
	try {
		decoded = decodeJwtForElectronApp(bearer);
	} catch (e) {
		error('[getDesktopSessionUser] Error decoding jwt', { e });
		return null;
	}

	const user = await db.query.Users.findFirst({
		where: eq(Users.id, decoded.userId),
	});
	if (!user) {
		error(
			'[getDesktopSessionUser] User not found in jwt session',
			decoded.userId
		);
		unauthorized();
	}

	return user;
});

export const getUser = cache(async (): Promise<User> => {
	const desktopSessionUser = await getDesktopSessionUser();
	if (desktopSessionUser) {
		return desktopSessionUser;
	}

	const clerkSessionUser = await getClerkSessionUser();
	if (!clerkSessionUser) {
		warn('No Clerk session found');
	}

	// At this point, if we
	if (!clerkSessionUser) {
		warn('No sessions found. Will throw 401');
		unauthorized();
	}

	return clerkSessionUser;
});

export const getMobileUser = cache(async (req: Request): Promise<User> => {
	return await getUser();
});

//
//
//
//
//
//
//

interface JwtPayload {
	sessionId: string;
	userId: number;
	requestId: string;
}

export function makeJwtForElectronApp(
	user: User,
	sessionId: string,
	request: DeviceAuthRequest
) {
	assert(JWT_SECRET);

	return jsonwebtoken.sign(
		{ sessionId, userId: user.id, requestId: request.id } as JwtPayload,
		JWT_SECRET,
		{
			expiresIn: '30d',
		}
	);
}

export function decodeJwtForElectronApp(jwt: string): JwtPayload {
	assert(JWT_SECRET);

	// This may throw.
	const decoded = jsonwebtoken.verify(jwt, JWT_SECRET) as JwtPayload;
	debug('Decoded jwt', decoded);

	return decoded;
}
