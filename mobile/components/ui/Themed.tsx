import {
	Text as DefaultText,
	View as DefaultView,
	useColorScheme,
} from 'react-native';

export function useThemeColor(
	props: { light?: string; dark?: string },
	colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
	const theme = useColorScheme() ?? 'light';
	const colorFromProps = props[theme];

	if (colorFromProps) {
		return colorFromProps;
	}
	return Colors[theme][colorName];
}

export type ThemeProps = {
	lightColor?: string;
	darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
	const { style, lightColor, darkColor, ...otherProps } = props;
	const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

	return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export const Colors = {
	light: {
		text: '#fff',
		background: '#fff',
		primary: '#2196F3',
		tint: '#2f95dc',
		tabIconDefault: '#ccc',
		tabIconSelected: '#2f95dc',
	},
	dark: {
		text: '#fff',
		background: '#000',
		primary: '#2196F3',
		tint: '#fff',
		tabIconDefault: '#ccc',
		tabIconSelected: '#fff',
	},
};
