import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';

// Create a ref to store the scroll function
const scrollToBottomRef = {
	current: null as (() => void) | null,
};

export function HapticTab(props: BottomTabBarButtonProps) {
	const navigation = useNavigation();
	const lastTapRef = useRef(0);

	const handlePress = (ev: any) => {
		const now = Date.now();
		if (now - lastTapRef.current < 300) {
			// If we're on the chat tab and tapping it again, scroll to bottom
			const state = navigation.getState();
			if (state && state.index === 0 && scrollToBottomRef.current) {
				scrollToBottomRef.current();
			}
		}
		lastTapRef.current = now;

		if (process.env.EXPO_OS === 'ios') {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		}
		props.onPressIn?.(ev);
	};

	return <PlatformPressable {...props} onPressIn={handlePress} />;
}

// Export the ref so the Chat component can set it
export { scrollToBottomRef };
