import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { NotificationTask } from '../tasks/NotificationTask';
import { ThemedText } from './ui/ThemedText';
import { ThemedView } from './ui/ThemedView';

export function UpdateStatus() {
	const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
	const [isEnabled, setIsEnabled] = useState(false);

	useEffect(() => {
		const checkStatus = async () => {
			try {
				const isRegistered = await NotificationTask.isRegistered();
				setIsEnabled(isRegistered);
			} catch (error) {
				console.error('Error checking task status:', error);
			}
		};

		checkStatus();

		// Check status every minute
		const interval = setInterval(() => {
			checkStatus();
			// Update the last update time to trigger re-render
			setLastUpdate(new Date());
		}, 60000);

		return () => clearInterval(interval);
	}, []);

	if (!isEnabled) {
		return (
			<ThemedView style={styles.container}>
				<ThemedText>Background updates are disabled</ThemedText>
			</ThemedView>
		);
	}

	return (
		<ThemedView style={styles.container}>
			<ThemedText>Background updates are enabled</ThemedText>
			{lastUpdate && (
				<ThemedText style={styles.timestamp}>
					Last checked: {lastUpdate.toLocaleTimeString()}
				</ThemedText>
			)}
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 12,
		borderRadius: 10,
		backgroundColor: 'rgba(0, 0, 0, 0.03)',
	},
	timestamp: {
		fontSize: 12,
		opacity: 0.7,
	},
});
