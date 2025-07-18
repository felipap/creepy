import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native'
import { useLocationTrackingContext } from '../TrackerProvider'

export function TrackPillButton() {
  const { isTracking, startTracking, stopTracking } =
    useLocationTrackingContext()
  const theme = useColorScheme()

  const onPress = () => {
    if (isTracking) {
      stopTracking()
    } else {
      startTracking()
    }
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isTracking
              ? theme === 'light'
                ? '#007AFF'
                : '#B4E3FF'
              : '#000',
          },
        ]}
      >
        {/* {icon} */}
        <Text
          style={[
            styles.title,
            { color: theme === 'light' ? 'white' : 'black' },
          ]}
        >
          {isTracking ? 'Tracking ON' : 'Beacon OFF'}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    paddingHorizontal: 20,
    width: 190,
    gap: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
})
