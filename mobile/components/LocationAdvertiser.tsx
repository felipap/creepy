import { trySaveLocationToLocalStorage } from '@/tasks/LocationTrackingTask';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Button,
	StyleSheet,
	Switch,
	Text,
	View,
} from 'react-native';
import { sendLocationToApi } from '../api';
import { useTrackerState } from './TrackerProvider';

// const checkIsEmulator = async () => {
// 	const isDevice = await Device.isDevice;
// 	// isDevice will be false if running in an emulator/simulator
// 	// console.log("Is this an emulator?", !isDevice);
// 	return !isDevice;
// };
// const [isEmulator, setIsEmulator] = useState(true);
// useEffect(() => {
// 	checkIsEmulator().then(setIsEmulator);
// }, []);

export const LocationAdvertiser = () => {
	const { isTracking, lastSent, errorMsg, startTracking, stopTracking } =
		useTrackerState();

	return (
		<View style={styles.container}>
			<View style={styles.headerRow}>
				<Text style={styles.label}>Location Tracking:</Text>
				<Switch
					value={isTracking}
					onValueChange={(value) => (value ? startTracking() : stopTracking())}
					trackColor={{ false: '#767577', true: '#81b0ff' }}
					thumbColor={isTracking ? '#0000ff' : '#f4f3f4'}
				/>
			</View>

			{errorMsg ? (
				<Text style={styles.errorText}>{errorMsg}</Text>
			) : isTracking ? (
				<Text style={styles.statusText}>
					Tracking active. Last update:{' '}
					{lastSent ? lastSent.toLocaleTimeString() : 'None yet'}
				</Text>
			) : (
				<Text style={styles.statusText}>Tracking inactive</Text>
			)}

			<Button
				title="Send Location"
				onPress={async () => {
					const loc = await Location.getCurrentPositionAsync();
					await trySaveLocationToLocalStorage(loc, 'button');
					sendLocationToApi(loc, 'button');
				}}
			/>
		</View>
	);
};

export const CurrentAddressComponent = () => {
	const [address, setAddress] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			try {
				// Request location permissions
				let { status } = await Location.requestForegroundPermissionsAsync();
				if (status !== 'granted') {
					setErrorMsg('Permission to access location was denied');
					setLoading(false);
					return;
				}

				// Get current position
				let location = await Location.getCurrentPositionAsync({
					accuracy: Location.Accuracy.Balanced,
				});

				// Reverse geocode to get address
				let geocode = await Location.reverseGeocodeAsync({
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
				});

				if (geocode && geocode.length > 0) {
					const addressObj = geocode[0];
					const formattedAddress = [
						addressObj.name,
						addressObj.street,
						addressObj.city,
						addressObj.region,
						addressObj.postalCode,
						addressObj.country,
					]
						.filter(Boolean)
						.join(', ');

					setAddress(formattedAddress);
				} else {
					setErrorMsg('Unable to determine address');
				}
			} catch (error) {
				setErrorMsg(`Error: ${error.message}`);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	let content;
	if (loading) {
		content = <ActivityIndicator size="large" color="#0000ff" />;
	} else if (errorMsg) {
		content = <Text style={styles.errorText}>{errorMsg}</Text>;
	} else if (address) {
		content = <Text style={styles.addressText}>{address}</Text>;
	} else {
		content = <Text style={styles.errorText}>Address not available</Text>;
	}

	return (
		<View style={styles.container}>
			<Text style={styles.label}>Current Location:</Text>
			{content}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
		backgroundColor: '#f5f5f5',
		borderRadius: 8,
	},
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	label: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	addressText: {
		fontSize: 14,
		color: '#333',
	},
	statusText: {
		fontSize: 14,
		color: '#333',
	},
	errorText: {
		fontSize: 14,
		color: 'red',
	},
});
