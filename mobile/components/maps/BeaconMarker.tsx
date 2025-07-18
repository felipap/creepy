import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet } from 'react-native'
import { Marker } from 'react-native-maps'

export const BeaconMarker = ({
  coordinate,
}: {
  coordinate: { latitude: number; longitude: number }
}) => {
  const animation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ).start()
    }

    startAnimation()

    // Cleanup animation when component unmounts
    return () => {
      // animation.stopAnimation();
    }
  }, [animation])

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 2],
  })

  const opacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 0.2, 0],
  })

  return (
    <>
      <Marker
        coordinate={{
          ...coordinate,
          // latitude: coordinate.latitude + 0.0001,
          // longitude: coordinate.longitude,
        }}
        style={beaconStyles.centerDot}
      />
      {/* <Marker coordinate={coordinate} style={beaconStyles.centerDot} /> */}
      {/* <Marker coordinate={coordinate}> */}
      {/* <Animated.View
					style={[
						beaconStyles.beacon,
						{
							// transform: [{ scale }],
							opacity: 1,
						},
					]}
				/> */}
      {/* <View style={markerStyles.markerContainer}> */}
      {/* <View style={markerStyles.bubble}>
					<Text style={markerStyles.markerText}>Home</Text>
				</View> */}
      {/* </View> */}
      {/* </Marker> */}
    </>
  )
}

const beaconStyles = StyleSheet.create({
  beacon: {
    position: 'absolute',
    backgroundColor: 'red',
    width: 50,
    height: 50,
    // borderRadius: 25,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignSelf: 'center',
    bottom: 400,
  },
  centerDot: {
    // position: 'absolute',
    backgroundColor: 'red',
    width: 12,
    height: 12,
    borderRadius: 6,
    alignSelf: 'center',
    bottom: 29, // Centered relative to the beacon
    zIndex: 1, // Ensure it stays on top
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})

const markerStyles = StyleSheet.create({
  markerContainer: {
    shadowColor: '#000',
    display: 'flex',
    elevation: 15,
  },
  markerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  bubble: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: 'red', // '#007AFF', // iOS blue
    padding: 8,
    borderRadius: 16,
    borderColor: 'red', //'#007AFF',
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  // Create a triangle pointer below the bubble
  arrow: {
    backgroundColor: '#red',
    borderColor: 'transparent',
    borderWidth: 4,
    borderTopColor: '#red',
    alignSelf: 'center',
    marginTop: -2,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 4,
    borderTopColor: '#red',
    alignSelf: 'center',
    marginTop: -0.5,
  },
})
