import { Drawer as ExpoDrawer } from 'expo-router/drawer';
import React from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '../ui/colors';

interface DrawerProps {
	children: React.ReactNode;
}

export function Drawer({ children }: DrawerProps) {
	const colorScheme = useColorScheme();

	return (
		<ExpoDrawer
			screenOptions={{
				headerShown: false,
				drawerActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				drawerStyle: {
					backgroundColor: Colors[colorScheme ?? 'light'].background,
					width: 200,
				},
				drawerLabelStyle: {
					fontSize: 16,
					fontWeight: '500',
				},
			}}
		>
			{children}
		</ExpoDrawer>
	);
}
