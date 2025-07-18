import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Marker } from 'react-native-maps'

export function NiceMarker({
  label,
  coordinate,
}: {
  label: string
  coordinate: { latitude: number; longitude: number }
}) {
  return (
    <Marker
      coordinate={{
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      }}
    >
      <View style={markerStyles.markerContainer}>
        <View style={markerStyles.bubble}>
          <Text style={markerStyles.markerText}>{label}</Text>
        </View>
        {/* <View style={markerStyles.arrowBorder} /> */}
        {/* <View style={markerStyles.arrow} /> */}
      </View>
    </Marker>
  )
}

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
    backgroundColor: '#007AFF', // iOS blue
    padding: 8,
    borderRadius: 16,
    borderColor: '#007AFF',
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
    backgroundColor: '#007AFF',
    borderColor: 'transparent',
    borderWidth: 4,
    borderTopColor: '#007AFF',
    alignSelf: 'center',
    marginTop: -2,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 4,
    borderTopColor: '#007AFF',
    alignSelf: 'center',
    marginTop: -0.5,
  },
})
