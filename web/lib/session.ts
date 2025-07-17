import 'server-only';

import { User } from '@/db/schema';
import assert from 'assert';
import jsonwebtoken from 'jsonwebtoken';
import { cache } from 'react';
import { debug } from './logger';

export const JWT_SECRET = process.env.JWT_SECRET || '';
if (!JWT_SECRET) {
	throw new Error('JWT_SECRET is not set');
}

export const getUser = cache(async (): Promise<User> => {
	return { id: 1 };
	// const desktopSessionUser = await getDesktopSessionUser();
	// if (desktopSessionUser) {
	// 	return desktopSessionUser;
	// }
	// const clerkSessionUser = await getClerkSessionUser();
	// if (!clerkSessionUser) {
	// 	warn('No Clerk session found');
	// }
	// At this point, if we
	// if (!clerkSessionUser) {
	// 	warn('No sessions found. Will throw 401');
	// 	unauthorized();
	// }
	// return clerkSessionUser;
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

export function makeJwtForElectronApp(sessionId: string) {
	assert(JWT_SECRET);

	return jsonwebtoken.sign(
		{ sessionId, userId: 1, requestId: '1' } as JwtPayload,
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
