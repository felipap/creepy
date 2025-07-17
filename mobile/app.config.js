export default {
	expo: {
		name: 'Buddy',
		slug: 'buddy',
		version: '1.0.0',
		orientation: 'portrait',
		icon: './assets/images/icon.png',
		scheme: 'buddy',
		userInterfaceStyle: 'automatic',
		newArchEnabled: true,
		ios: {
			supportsTablet: false,
			bundleIdentifier: 'engineering.pi.buddy',
			infoPlist: {
				UIBackgroundModes: ['location', 'fetch', 'remote-notification'],
				NSLocationAlwaysAndWhenInUseUsageDescription:
					'Allow Buddy to use your location to provide contextual assistance.',
				NSLocationAlwaysUsageDescription:
					'Allow Buddy to use your location in the background',
				NSLocationWhenInUseUsageDescription:
					'Allow Buddy to use your location while using the app',
			},
			// googleServicesFile: './GoogleService-Info.plist',
			// bundleIdentifier: 'com.felipap.Buddy3' + (IS_PROD ? '' : '.debug'),
		},
		android: {
			adaptiveIcon: {
				foregroundImage: './assets/images/adaptive-icon.png',
				backgroundColor: '#ffffff',
			},
			edgeToEdgeEnabled: true,
			package: 'engineering.pi.buddy',
		},
		web: {
			bundler: 'metro',
			output: 'static',
			favicon: './assets/images/favicon.png',
		},
		plugins: [
			'expo-router',
			'expo-secure-store',
			'@react-native-google-signin/google-signin',
			[
				'expo-splash-screen',
				{
					image: './assets/images/splash-icon.png',
					imageWidth: 200,
					resizeMode: 'contain',
					backgroundColor: '#ffffff',
				},
			],
			[
				'expo-location',
				{
					locationAlwaysAndWhenInUsePermission:
						'Allow Buddy to use your location to provide contextual assistance.',
					locationAlwaysPermission:
						'Allow Buddy to use your location in the background',
					locationWhenInUsePermission:
						'Allow Buddy to use your location while using the app',
					isIosBackgroundLocationEnabled: true,
					isAndroidBackgroundLocationEnabled: true,
				},
			],
		],
		experiments: {
			typedRoutes: true,
		},
	},
};
