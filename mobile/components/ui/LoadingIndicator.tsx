import { ActivityIndicator } from 'react-native'

export function LoadingIndicator({
  size = 'small',
}: {
  size?: 'small' | 'large'
}) {
  return <ActivityIndicator size={size} />
}
