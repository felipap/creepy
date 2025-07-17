import {
	Pressable,
	StyleProp,
	StyleSheet,
	Text,
	useColorScheme,
	ViewStyle,
} from 'react-native';
import { ThemeProps, useThemeColor } from './Themed';

export type ButtonProps = ThemeProps & {
	onPress: () => void;
	title?: string;
	children?: React.ReactNode;
	disabled?: boolean;
	variant?: 'primary' | 'secondary';
	style?: StyleProp<ViewStyle>;
};

export function Button({
	variant = 'secondary',
	style,
	...props
}: ButtonProps) {
	const { onPress, title, disabled, lightColor, darkColor, children } = props;
	const backgroundColor = useThemeColor(
		{ light: lightColor, dark: darkColor },
		'primary'
	);
	const textColor = useThemeColor({}, 'background');
	const isDark = useColorScheme() === 'dark';

	return (
		<Pressable
			onPress={onPress}
			disabled={disabled}
			style={({ pressed }) => [
				styles.button,
				variant === 'primary' && { backgroundColor },
				variant === 'secondary' && {
					backgroundColor: isDark ? '#fff' : '#000',
				},
				{ opacity: pressed || disabled ? 0.7 : 1 },
				style,
			]}
		>
			{title || typeof children === 'string' ? (
				<Text style={[styles.buttonText, { color: textColor }]}>
					{title || children}
				</Text>
			) : (
				children
			)}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		paddingVertical: 12,
		paddingHorizontal: 32,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 16,
		fontWeight: '600',
	},
});
