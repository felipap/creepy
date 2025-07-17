import { History } from 'lucide-react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface Props {
	onPress: () => void;
}

export function OpenHistoryButton({ onPress }: Props) {
	return (
		<TouchableOpacity onPress={onPress}>
			<View style={styles.container}>
				<History size={24} color="black" />
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 8,
		// paddingHorizontal: 30,
		borderRadius: 25,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#333',
		wordWrap: 'nowrap',
	},
});
