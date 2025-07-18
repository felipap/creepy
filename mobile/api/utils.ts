import { getClerkToken } from '@/lib/auth';
import { debug } from '@/lib/logger';
import { LogBox } from 'react-native';

const EXPO_PUBLIC_SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';
if (!EXPO_PUBLIC_SERVER_URL) {
	throw new Error('Missing EXPO_PUBLIC_SERVER_URL');
}

export const API_HOST = __DEV__
	? 'https://64d25a897d7e.ngrok-free.app'
	: EXPO_PUBLIC_SERVER_URL; // Endpoint for location data

// log('API_HOST', API_HOST);

export async function getBearerTokenOrThrow(): Promise<string> {
	const start = Date.now();
	const token = await getClerkToken();
	if (!token) {
		throw new Error('user is not signed in');
	}
	const end = Date.now();
	debug(`getHeaders took ${end - start}ms`);
	return token;
}

LogBox.ignoreAllLogs();

export async function fetchAPI(
	path: string,
	options?: RequestInit
): Promise<
	| {
			error: string;
			message?: string;
	  }
	| {
			data: any;
	  }
> {
	const token = await getClerkToken();
	if (!token) {
		return {
			error: 'user is not signed in',
		};
	}

	const url = pathJoin(API_HOST, path);

	options = {
		...options,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
			...options?.headers,
		},
	};

	let res;
	try {
		res = await fetch(url, options);
	} catch (e) {
		debug(`API connection failed url=${url}`, e);
		return {
			error: `Failed to connect to API url=${url}`,
		};
	}

	if (!res.ok) {
		if (
			res.status === 409 ||
			res.status === 500 ||
			res.status === 501 ||
			res.status === 502 ||
			res.status === 503
		) {
			const text = (await res.text()) as any;
			return {
				error: text.error || 'Unexpected API failure?!',
			};
		}

		const text = (await res.text()) as any;
		debug(`API request failed path=${path}`, {
			status: res.status,
			text,
		});

		return {
			error: text.error || 'Unexpected API failure?!',
		};
	}

	const json = await res.json();
	return {
		data: json,
	};
}

function pathJoin(a: string, b: string) {
	return a.replace(/\/$/, '') + '/' + b.replace(/^\//, '');
}
