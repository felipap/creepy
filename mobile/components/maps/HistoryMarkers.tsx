// https://www.youtube.com/watch?v=-6tywZ7OFRo

import { UserLocation } from '@/state/types'
import { FELIPE_PLACES } from '@/tasks/location-labels'
import React from 'react'
import { StyleSheet } from 'react-native'
import { Circle, Marker } from 'react-native-maps'
import { withBoundary } from '../withBoundary'

interface Props {
  locations: UserLocation[]
}

export const HistoryMarkers = withBoundary(({ locations }: Props) => {
  return (
    <>
      {locations.map((location, index) => (
        // https://github.com/react-native-maps/react-native-maps/blob/HEAD/docs/circle.md
        <Circle
          key={location.uniqueId}
          center={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          radius={25}
          fillColor={`rgba(122, 122, 255, ${
            0.1 + 0.7 * (index / locations.length)
          })`}
          // title={`Location ${location.id}`}
          zIndex={1}
        />
      ))}

      {FELIPE_PLACES.map((place) => (
        <Marker
          coordinate={place.coords}
          zIndex={0}
          key={place.label}
          centerOffset={{
            x: 0,
            y: 20,
          }}
          tracksViewChanges={false}
          title={place.label}
        >
          {/* <View style={styles.bubble}>
						<Text style={{ color: 'white' }}>{place.label}</Text>
					</View> */}
        </Marker>
      ))}
    </>
  )
})

export const styles = StyleSheet.create({
  bubble: {
    // flexDirection: 'row',
    // alignSelf: 'flex-start',
    backgroundColor: '#007AFFEE', // iOS blue
    padding: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    // ios rounded corner

    // borderColor: 'red', //'#007AFF',
    // borderWidth: 0.5,
    // shadowColor: '#000',
    // shadowOffset: {
    // 	width: 0,
    // 	height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
    // elevation: 2,
  },
})
