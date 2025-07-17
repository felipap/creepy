import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { NotificationsProvider } from '@/components/NotificationsProvider';
import { DarkTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
// import Toast from 'react-native-toast-message';
// import * as Sentry from '@sentry/react-native';
import { StoreContextProvider } from '@/state/store';
import { Slot } from 'expo-router';
import { Text, TextInput, useColorScheme } from 'react-native';
import { TrackerProvider } from '../components/TrackerProvider';

// Sentry.init({
// 	dsn: 'https://7feaac26b851c1613ca382fd1afa4f64@o175888.ingest.us.sentry.io/4509025209810944',

// 	// uncomment the line below to enable Spotlight (https://spotlightjs.com)
// 	// spotlight: __DEV__,
// });

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// @ts-ignore
Text.defaultProps = Text.defaultProps || {};
// @ts-ignore
Text.defaultProps.allowFontScaling = false;
// @ts-ignore
TextInput.defaultProps = TextInput.defaultProps || {};
// @ts-ignore
TextInput.defaultProps.allowFontScaling = false;

// export default Sentry.wrap(function RootLayout() {
export default function RootLayout() {
	const colorScheme = useColorScheme();

	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: 2 } },
	});

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<StoreContextProvider>
				<QueryClientProvider client={queryClient}>
					<ThemeProvider
						value={colorScheme === 'dark' ? DarkTheme : LightTheme}
					>
						<TrackerProvider>
							<NotificationsProvider>
								<StatusBar style="auto" />
								<Slot />
								{/* <Toast /> */}
							</NotificationsProvider>
						</TrackerProvider>
					</ThemeProvider>
				</QueryClientProvider>
			</StoreContextProvider>
		</GestureHandlerRootView>
	);
}

export const LightTheme: Theme = {
	dark: false,
	colors: {
		primary: 'rgb(0, 122, 255)',
		background: 'rgb(255, 255, 255)',
		card: 'rgb(255, 255, 255)',
		text: 'rgb(28, 28, 30)',
		border: 'rgb(216, 216, 216)',
		notification: 'rgb(255, 59, 48)',
	},
	fonts: DarkTheme.fonts,
};
