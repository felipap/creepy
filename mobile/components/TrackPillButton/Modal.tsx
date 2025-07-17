import { type Activity } from '@/api';
import {
	FlatList,
	Modal as ReactNativeModal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

interface Props {
	visible: boolean;
	onClose: () => void;
	onSelectActivity: (activity: Activity) => void;
	activities: Activity[];
}

export function Modal({
	visible,
	onClose,
	onSelectActivity,
	activities,
}: Props) {
	return (
		<ReactNativeModal
			animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContent}>
					<Text style={styles.modalTitle}>Select Activity</Text>
					<FlatList
						data={activities}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<TouchableOpacity
								style={styles.activityItem}
								onPress={() => onSelectActivity(item)}
							>
								<Text style={styles.activityText}>
									{item.emoji} {item.label}
								</Text>
							</TouchableOpacity>
						)}
					/>
					<TouchableOpacity style={styles.closeButton} onPress={onClose}>
						<Text style={styles.closeButtonText}>Cancel</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ReactNativeModal>
	);
}

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
		backgroundColor: '#fff',
		borderRadius: 20,
		padding: 20,
		width: '80%',
		maxHeight: '70%',
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 15,
		textAlign: 'center',
		color: '#333',
	},
	activityItem: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	activityText: {
		fontSize: 16,
		color: '#333',
	},
	closeButton: {
		marginTop: 15,
		padding: 10,
		backgroundColor: '#f0f0f0',
		borderRadius: 10,
	},
	closeButtonText: {
		textAlign: 'center',
		color: '#333',
		fontSize: 16,
	},
});
