import { useMainStore } from '@/state/store'

export function useIsTracking() {
  const { isTracking, setIsTracking } = useMainStore()
  return { isTracking, setIsTracking }
}
