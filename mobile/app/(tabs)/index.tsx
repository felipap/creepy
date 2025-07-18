import { LocationMap } from '@/components/maps/LocationMap'
import { OpenHistoryButton } from '@/components/OpenHistoryButton'
import { TrackPillButton } from '@/components/TrackPillButton'
import { router } from 'expo-router'
import { View } from 'react-native'

export default function Screen() {
  return (
    <>
      <LocationMap>
        {/* <BeaconMarker
					coordinate={{
						// accuracy: 15.418041214274078,
						// altitude: 51.677453480009845,
						// altitudeAccuracy: 30,
						// heading: -1,
						latitude: 37.772112595814505,
						longitude: -122.4329801148051,
						// speed: -1,
					}}
				/> */}
        <View
          style={{
            position: 'absolute',
            top: 60,
            right: 20,
            // width: 60,
            flex: 1,
          }}
        >
          <OpenHistoryButton
            onPress={() => {
              router.push('/(tabs)/history')
            }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 100,
            width: '100%',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <TrackPillButton />
        </View>
      </LocationMap>
    </>
  )
}
