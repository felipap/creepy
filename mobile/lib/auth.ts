export const AUTHOR_KEY = process.env.EXPO_PUBLIC_AUTHOR_KEY || '';

if (!AUTHOR_KEY) {
	throw new Error('Missing AUTHOR_KEY');
}

export async function getClerkToken() {
	return AUTHOR_KEY;
}
