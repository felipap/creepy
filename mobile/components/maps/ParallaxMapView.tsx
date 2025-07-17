import { useRef, useState, type PropsWithChildren } from 'react';
import {
	Dimensions,
	StyleSheet,
	TouchableOpacity,
	useColorScheme,
	View,
} from 'react-native';
import {
	GestureHandlerRootView,
	PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
	runOnJS,
	useAnimatedGestureHandler,
	useAnimatedStyle,
	useSharedValue,
	withDecay,
	withSpring,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MINIMIZED_MAP_HEIGHT = 100;
const HANDLE_HEIGHT = 30;
const CONTENT_PEEK_HEIGHT = 200;

interface Props extends PropsWithChildren {
	overlay?: React.ReactNode;
}

export default function ParallaxMapView({ children, overlay }: Props) {
	const colorScheme = useColorScheme() ?? 'light';
	const bottom = 0;

	// state
	const translateY = useSharedValue(SCREEN_HEIGHT - CONTENT_PEEK_HEIGHT);
	const [isExpanded, setIsExpanded] = useState(false);
	const overlayRef = useRef<View>(null);
	const [childrenHeight, setChildrenHeight] = useState(1200);

	const maxMapHeight = SCREEN_HEIGHT - CONTENT_PEEK_HEIGHT;

	// Animated styles for the map container
	const mapAnimatedStyle = useAnimatedStyle(() => {
		return {
			height: translateY.value,
		};
	});

	// Quick hack to constantly refresh this component.
	// const [refresh, setRefresh] = useState(0);
	// useEffect(() => {
	// 	setInterval(() => {
	// 		setRefresh((prev) => prev + 1);
	// 	}, 100);
	// }, []);

	const minTranslateY = Math.max(
		MINIMIZED_MAP_HEIGHT,
		SCREEN_HEIGHT - childrenHeight
	);

	// Handle the drag gesture
	const panGestureHandler = useAnimatedGestureHandler<any, { startY: number }>({
		onStart: (_, ctx) => {
			if (isNaN(translateY.value)) {
				throw new Error('Invalid startY value');
			}
			ctx.startY = translateY.value;
		},
		onActive: (event, ctx) => {
			let desiredY = ctx.startY + event.translationY;
			const newY = Math.max(
				Math.min(desiredY, maxMapHeight),
				-(childrenHeight - SCREEN_HEIGHT)
			);
			translateY.value = newY;
		},
		onEnd: (event, ctx) => {
			// If user releases after dragging significantly, snap to expanded or collapsed
			const shouldExpandChildren = translateY.value < (SCREEN_HEIGHT * 2) / 3;

			if (shouldExpandChildren && isExpanded) {
				translateY.value = withDecay({
					velocity: event.velocityY,
					clamp: [-(childrenHeight - SCREEN_HEIGHT), maxMapHeight],
				});
				return;
			}

			translateY.value = withSpring(
				// shouldExpand ? -maxMapHeight + MINIMIZED_MAP_HEIGHT : 0,
				shouldExpandChildren ? minTranslateY : maxMapHeight,
				{ damping: 20, stiffness: 90 }
			);
			runOnJS(setIsExpanded)(shouldExpandChildren);
		},
	});

	// Animated styles for the content container
	const contentAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: translateY.value }],
		};
	});

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View style={styles.container}>
				{/* <View
					style={{
						position: 'absolute',
						top: 60,
						right: 30,
						zIndex: 12,
					}}
				>
					<Text
						style={{
							fontWeight: 'bold',
							textShadowColor: 'red',
							textShadowOffset: { width: 1, height: 1 },
							fontSize: 12,
						}}
					>
						translateY {translateY.value.toFixed(0)}
					</Text>
				</View> */}

				{/* Map */}
				<Animated.View style={[styles.mapContainer, mapAnimatedStyle]}>
					<View style={{ width: '100%' }}>{children}</View>
				</Animated.View>

				{/* Draggable content */}
				<PanGestureHandler onGestureEvent={panGestureHandler}>
					<Animated.View
						style={[
							styles.contentWrapper,
							contentAnimatedStyle,
							{
								height: childrenHeight,
								backgroundColor: colorScheme === 'dark' ? '#111' : 'white',
							},
						]}
					>
						{/* Handle */}
						<View style={styles.handleContainer}>
							<TouchableOpacity
								style={styles.handle}
								onPress={() => {
									const isNowExpanded = !isExpanded;
									setIsExpanded(isNowExpanded);
									translateY.value = withSpring(
										isNowExpanded ? -maxMapHeight + MINIMIZED_MAP_HEIGHT : 0,
										{ damping: 20, stiffness: 90 }
									);
								}}
							/>
						</View>

						{/* Content */}
						<View
							ref={overlayRef}
							onLayout={async (event) => {
								overlayRef.current!.measure((x, y, _, height) => {
									// const { height } = event.nativeEvent.layout;
									// console.log("setting children height", height);
									setChildrenHeight(height);
								});
							}}
							style={[
								styles.children,
								{
									paddingBottom: bottom + MINIMIZED_MAP_HEIGHT,
								},
							]}
						>
							{overlay}
						</View>
					</Animated.View>
				</PanGestureHandler>
			</View>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		overflow: 'hidden',
	},
	mapContainer: {
		height: MINIMIZED_MAP_HEIGHT,
		overflow: 'hidden',
		position: 'absolute',
		width: '100%',
		// zIndex: -1,
		zIndex: 10,
	},
	children: {},
	contentWrapper: {
		position: 'relative',
		zIndex: 10,
		display: 'flex',
		width: '100%',
		// marginTop: MINIMIZED_MAP_HEIGHT,
		marginTop: -15,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
		overflow: 'hidden',
	},
	handleContainer: {
		height: HANDLE_HEIGHT,
		justifyContent: 'center',
		alignItems: 'center',
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -3 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	handle: {
		width: 80,
		height: 5,
		backgroundColor: '#ccc',
		borderRadius: 3,
		marginBottom: 5,
	},
	handleText: {
		fontSize: 12,
		color: '#999',
		marginTop: 5,
	},
});
