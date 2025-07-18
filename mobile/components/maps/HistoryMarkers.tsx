// https://www.youtube.com/watch?v=-6tywZ7OFRo

import { FELIPE_PLACES } from '@/lib/location-labels'
import { useMainStore } from '@/state/store'
import React, { useMemo } from 'react'
import { StyleSheet, useColorScheme } from 'react-native'
import { Circle, Marker } from 'react-native-maps'
import { withBoundary } from '../withBoundary'

interface Props {
  zoom: number
}

export const HistoryMarkers = withBoundary(({ zoom }: Props) => {
  const { locations } = useMainStore()
  const theme = useColorScheme()

  const sampledLocations = useMemo(() => {
    return [...locations]
      .sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      })
      .filter((l) => Math.random() < 0.1)
  }, [locations])

  // We're resizing the circles based on zoom level. I came up with this formula
  // by trial and error. Performance is not pretty... clustering would be
  // better.
  const dim = useMemo(() => {
    return 900_000 / Math.pow(2, zoom || 14)
  }, [zoom])

  return (
    <>
      {sampledLocations.map((location, index) => (
        // https://github.com/react-native-maps/react-native-maps/blob/HEAD/docs/circle.md
        <Circle
          key={location.uniqueId}
          center={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          radius={dim}
          // title={`Location ${location.id}`}
          strokeWidth={0}
          strokeColor="transparent"
          fillColor={
            theme === 'light'
              ? `rgba(122, 122, 255, ${0.6 + 0.6 * (index / locations.length)})`
              : `rgba(255, 255, 112, ${0.6 + 0.6 * (index / locations.length)})`
          }
          style={{ opacity: 0.5 }}
          zIndex={1}
        />
      ))}

      {false &&
        FELIPE_PLACES.map((place) => (
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
