export type UserLocation = {
	id: string;
	timestamp: string;
	latitude: number;
	longitude: number;
	source: 'background' | 'button' | 'foreground' | null;
	label: string | null;
};

export type User = {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	imageUrl: string;
	chatId: string | null;
	notificationsEnabled: boolean;
};

export type State = {
	user: User | null;
	locations: UserLocation[];
	isTracking: boolean;
	lastSeenHistoryTabAt: string | null;
	lastLocationAt: string | null;
};

export type Action = {
	setLastSeenHistoryTabAt: (lastSeenHistoryTabAt: string | null) => void;
	setIsTracking: (isTracking: boolean) => void;
	addLocation: (location: UserLocation) => void;
	removeLocation: (id: string) => void;
	setUser: (user: User | null) => void;
};
