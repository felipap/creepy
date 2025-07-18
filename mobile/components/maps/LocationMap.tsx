import { ThemedText } from '@/components/ui/ThemedText'
import { ThemedView } from '@/components/ui/ThemedView'
import * as Location from 'expo-location'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Dimensions, StyleSheet } from 'react-native'
import MapView from 'react-native-maps'
import { HistoryMarkers } from './HistoryMarkers'

interface Props {
  children: React.ReactNode
}

export const LocationMap = ({ children }: Props) => {
  const { location, error, loading } = useCurrentLocation()
  const mapRef = useRef<MapView>(null)
  const [zoom, setZoom] = useState(0.4)

  useEffect(() => {
    async function load() {
      if (mapRef.current) {
        const camera = await mapRef.current!.getCamera()
        if (camera.zoom) {
          setZoom(camera.zoom)
        }
      }
    }
    load()
  }, [zoom])

  // Changing region coordinates will reset the camera, so we must memoize this.
  const firstLocation = useMemo(() => location || null, [!!location])

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <ThemedText style={styles.text}>Loading map...</ThemedText>
      </ThemedView>
    )
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    )
  }

  if (!location) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.text}>Unable to get location</ThemedText>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <MapView
        ref={mapRef}
        style={[styles.map, { height: 810 }]}
        region={{
          latitude: firstLocation!.coords.latitude,
          longitude: firstLocation!.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onRegionChange={(r, d) => {
          // console.log('onRegionChange', r, d)
          setZoom(
            Math.log2(
              360 * (Dimensions.get('window').width / 256 / r.longitudeDelta),
            ) + 1,
          )
        }}
        // scrollEnabled={false}z
        // zoomTapEnabled={false}
        // pitchEnabled={false}
        // rotateEnabled={false}
        // showsTraffic
        // showsScale
        // zoomEnabled={false}
        // showsMyLocationButton={true}
        showsUserLocation
        // Position compass under the history button.
        compassOffset={{
          x: -10,
          y: 60,
        }}
        showsCompass
        initialCamera={{
          zoom: 0.4,
          altitude: 18_000,
          heading: 0,
          pitch: 0,
          center: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        }}
      >
        {/* <NiceMarker coordinate={location.coords} label="Work" /> */}

        {/* <BeaconMarker coordinate={location.coords} /> */}
        <HistoryMarkers zoom={zoom} />

        {children}

        {/* <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Your Location"
          description="You are here"
        >
          <Callout tooltip>
            <View style={styles.calloutContainer}>
              <Text style={styles.calloutText}>Work</Text>
            </View>
          </Callout>
        </Marker> */}
      </MapView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    // margin: 10,
  },
  map: {
    width: '100%',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  calloutContainer: {
    width: 70,
    height: 30,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
})

function useCurrentLocation() {
  const [error, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState<Location.LocationObject | null>(null)

  callEvery(1000, async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        setLoading(false)
        return
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })

      // console.log(
      // 	'Will set currentLocation',
      // 	currentLocation.coords.altitude
      // );

      setLocation(currentLocation)
    } catch (error) {
      setErrorMsg(`Error getting location: ${error.message}`)
    } finally {
      setLoading(false)
    }

    // console.log(
    //   'LocationMap useEffect()',
    //   (new Date().getTime() - start.getTime()) / 1000,
    // )
  })

  return {
    location,
    error,
    loading,
  }
}

// Beware: fn() closure will not be updated.
function callEvery(ms: number, fn: () => void) {
  const interval = setInterval(fn, ms)
  return () => clearInterval(interval)
}
