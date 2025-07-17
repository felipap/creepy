import { createContext, useContext } from 'react';

export function useTrackerState() {
	return useContext(LocationContext);
}

type LocationContextType = {
	location: Location | null;
	error: Error | null;
	lastSent: Date | null;
	isTracking: boolean;
	startTracking: () => void;
	stopTracking: () => void;
	errorMsg: string | null;
};

export const LocationContext = createContext<LocationContextType>({
	location: null,
	error: null,
	lastSent: null,
	isTracking: false,
	errorMsg: null,
	startTracking: () => {},
	stopTracking: () => {},
});
