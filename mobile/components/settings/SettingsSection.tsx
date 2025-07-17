import { ThemedText } from '@/components/ui/ThemedText';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { ThemedView } from '../ui/ThemedView';

const styles = StyleSheet.create({
	section: {
		padding: 16,
		borderRadius: 12,
		borderCurve: 'continuous',
		gap: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: -6,
	},
});

export function SettingsSection({
	title,
	children,
	style,
}: {
	title: string;
	children: React.ReactNode;
	style?: StyleProp<ViewStyle>;
}) {
	return (
		<ThemedView
			style={[style, styles.section]}
			lightColor="#FFF"
			darkColor="#111"
		>
			<ThemedText style={styles.sectionTitle}>{title}</ThemedText>
			{children}
		</ThemedView>
	);
}
