export const EXPO_PUBLIC_AUTHOR_KEY = process.env.EXPO_PUBLIC_AUTHOR_KEY || '';

if (!EXPO_PUBLIC_AUTHOR_KEY) {
	throw new Error('Missing EXPO_PUBLIC_AUTHOR_KEY');
}

export async function getClerkToken() {
	return EXPO_PUBLIC_AUTHOR_KEY;
}
