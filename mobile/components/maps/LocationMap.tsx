import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

interface Props {
	children: React.ReactNode;
}

export const LocationMap = ({ children }: Props) => {
	const [location, setLocation] = useState<Location.LocationObject | null>(
		null
	);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setInterval(() => {
			load();
		}, 1000);

		async function load() {
			try {
				let { status } = await Location.requestForegroundPermissionsAsync();
				if (status !== 'granted') {
					setErrorMsg('Permission to access location was denied');
					setLoading(false);
					return;
				}

				let currentLocation = await Location.getCurrentPositionAsync({
					accuracy: Location.Accuracy.Balanced,
				});

				// console.log(
				// 	'Will set currentLocation',
				// 	currentLocation.coords.altitude
				// );

				setLocation(currentLocation);
			} catch (error) {
				setErrorMsg(`Error getting location: ${error.message}`);
			} finally {
				setLoading(false);
			}
		}
		load();
	}, []);

	if (loading) {
		return (
			<ThemedView style={styles.container}>
				<ActivityIndicator size="large" color="#0000ff" />
				<ThemedText style={styles.text}>Loading map...</ThemedText>
			</ThemedView>
		);
	}

	if (errorMsg) {
		return (
			<ThemedView style={styles.container}>
				<ThemedText style={styles.errorText}>{errorMsg}</ThemedText>
			</ThemedView>
		);
	}

	if (!location) {
		return (
			<ThemedView style={styles.container}>
				<ThemedText style={styles.text}>Unable to get location</ThemedText>
			</ThemedView>
		);
	}

	return (
		<ThemedView style={styles.container}>
			<MapView
				// showsMyLocationButton={true}
				style={[styles.map, { height: 810 }]}
				region={{
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01,
				}}
				// scrollEnabled={false}
				// zoomTapEnabled={false}
				// pitchEnabled={false}
				// rotateEnabled={false}
				// zoomEnabled={false}
				initialCamera={{
					zoom: 0.4,
					altitude: 3000,
					center: {
						latitude: location.coords.latitude,
						longitude: location.coords.longitude,
					},
					pitch: 0,
					heading: 0,
				}}
			>
				{/* <NiceMarker coordinate={location.coords} label="Work" /> */}
				{/* <BeaconMarker coordinate={location.coords} /> */}

				{children}

				{/* <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Your Location"
          description="You are here"
        >
          <Callout tooltip>
            <View style={styles.calloutContainer}>
              <Text style={styles.calloutText}>Work</Text>
            </View>
          </Callout>
        </Marker> */}
			</MapView>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// padding: 16,
		// margin: 10,
	},
	map: {
		width: '100%',
	},
	text: {
		fontSize: 16,
		textAlign: 'center',
		marginTop: 10,
	},
	errorText: {
		fontSize: 16,
		color: 'red',
		textAlign: 'center',
	},
	calloutContainer: {
		width: 70,
		height: 30,
		paddingHorizontal: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 122, 255, 0.9)',
		borderRadius: 15,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	calloutText: {
		color: '#FFFFFF',
		fontWeight: '600',
		fontSize: 14,
		textAlign: 'center',
	},
});
