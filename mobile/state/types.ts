export type UserLocation = {
	id: string;
	uniqueId: string;
	timestamp: string;
	latitude: number;
	longitude: number;
	source: 'background' | 'button' | 'foreground' | null;
	accuracy: number | null;
	label: string | null;
	// When set, the location was synced to the server.
	remoteId: string | null;
	remoteSyncedAt: string | null;
};

export type State = {
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
	setLocationsRemoteIds: (args: { id: string; remoteId: string }[]) => void;
};
