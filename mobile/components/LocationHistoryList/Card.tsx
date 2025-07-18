import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { useMainStore } from '@/state/store';
import { UserLocation } from '@/state/types';
import dayjs from 'dayjs';
import { withBoundary } from '../withBoundary';

interface Props {
	location: UserLocation;
	firstSeen?: boolean;
}

export const LocationCard = withBoundary(
	({ location, firstSeen = false }: Props) => {
		const { removeLocation } = useMainStore();

		return (
			<View>
				<ThemedText type="defaultSemiBold">
					{location.id}: {formatDate(new Date(location.timestamp))}
				</ThemedText>
			</View>
		);

		return (
			<ThemedView style={[styles.container, firstSeen && styles.firstSeen]}>
				<TouchableOpacity
					onPress={() => removeLocation(location.id)}
					style={styles.removeButton}
				>
					<Ionicons name="trash-outline" size={20} color="red" />
				</TouchableOpacity>
				<View style={styles.header}>
					<ThemedText type="defaultSemiBold">
						{formatDate(new Date(location.timestamp))}
					</ThemedText>
				</View>
				{/* <ThemedText type="default" style={styles.source}>
				Source: {location.source}
			</ThemedText> */}
				<View style={styles.cardContent}>
					<ThemedText type="small">source: {location.source}</ThemedText>
					<ThemedText type="small">label: {location.label}</ThemedText>
				</View>
				{/* <ThemedText type="defaultSemiBold">{location.id}</ThemedText> */}
				{/* <View style={styles.cardContent}>
				<View style={styles.coordinateRow}>
					<ThemedText>Latitude: </ThemedText>
					<ThemedText type="defaultSemiBold">
						{parseFloat(location.latitude).toFixed(6)}
					</ThemedText>
				</View>
				<View style={styles.coordinateRow}>
					<ThemedText>Longitude: </ThemedText>
					<ThemedText type="defaultSemiBold">
						{parseFloat(location.longitude).toFixed(6)}
					</ThemedText>
				</View>
				<View style={styles.coordinateRow}>
					<ThemedText>Accuracy: </ThemedText>
					<ThemedText type="defaultSemiBold">
						{location.accuracy?.toFixed(2)}m
					</ThemedText>
				</View>
			</View> */}
			</ThemedView>
		);
	}
);

function formatDate(date: Date) {
	const isToday = dayjs(date).isSame(dayjs(), 'day');
	if (isToday) {
		return date.toLocaleString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
		});
	}
	return date.toLocaleString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}
