import { LocationHistoryList } from '@/components/LocationHistoryList'
import { Button } from '@/components/ui'
import { ThemedText } from '@/components/ui/ThemedText'
import { ThemedView } from '@/components/ui/ThemedView'
import { syncAllPendingLocations } from '@/state/sync'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function SyncButton() {
  function onPressSync() {
    console.log('onPressSync')
    syncAllPendingLocations()
  }

  return (
    <View>
      <Button onPress={onPressSync}>Sync All</Button>
    </View>
  )
}

function BackButton() {
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={{ paddingRight: 10 }}
    >
      <Ionicons name="chevron-back" size={24} color="#007AFF" />
    </TouchableOpacity>
  )
}

export default function Screen() {
  const { top } = useSafeAreaInsets()

  return (
    <ThemedView style={[styles.container, { paddingTop: top + 40 }]}>
      <ThemedView style={styles.titleContainer}>
        <BackButton />
        <ThemedText type="title">Location History</ThemedText>
      </ThemedView>

      {/* <SyncButton /> */}

      <ScrollView style={styles.scrollView}>
        <LocationHistoryList />
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    gap: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
})
