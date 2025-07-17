import { fetchActivities } from '@/api';
import { useMainStore } from '@/state/store';
import { useQuery } from '@tanstack/react-query';

export function useIsTracking() {
	const { isTracking, setIsTracking } = useMainStore();
	return { isTracking, setIsTracking };
}

export function useAllActivities() {
	return useQuery({
		queryKey: ['activities'],
		queryFn: () => fetchActivities(),
		// subscribed: isFocused,
	});
}
