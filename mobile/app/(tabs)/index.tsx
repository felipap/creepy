import { HistoryMarkers } from '@/components/maps/HistoryMarkers';
import { LocationMap } from '@/components/maps/LocationMap';
import { OpenHistoryButton } from '@/components/OpenHistoryButton';
import { TrackPillButton } from '@/components/TrackPillButton';
import { useMainStore } from '@/state/store';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';

export default function Screen() {
	const { locations } = useMainStore();

	const latestLocations = useMemo(() => {
		return [...locations]
			.sort((a, b) => {
				return (
					new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
				);
			})
			.slice(0, 20)
			.map((l) => ({
				...l,
				longitude: l.longitude,
				latitude: l.latitude,
			}));
	}, [locations]);

	return (
		<>
			<LocationMap>
				{/* <BeaconMarker
					coordinate={{
						// accuracy: 15.418041214274078,
						// altitude: 51.677453480009845,
						// altitudeAccuracy: 30,
						// heading: -1,
						latitude: 37.772112595814505,
						longitude: -122.4329801148051,
						// speed: -1,
					}}
				/> */}
				<HistoryMarkers locations={latestLocations} />
				<View
					style={{
						position: 'absolute',
						top: 60,
						right: 20,
						// width: 60,
						flex: 1,
					}}
				>
					<OpenHistoryButton
						onPress={() => {
							router.push('/(tabs)/history');
						}}
					/>
				</View>
				<View
					style={{
						position: 'absolute',
						bottom: 100,
						width: '100%',
						alignItems: 'center',
						flex: 1,
					}}
				>
					<TrackPillButton />
				</View>
			</LocationMap>
		</>
	);
}
