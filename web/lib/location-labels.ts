type Coordinate = {
  latitude: number
  longitude: number
}

export const FELIPE_PLACES = [
  {
    label: 'home',
    radiusMeter: 20,
    coords: {
      latitude: 37.77,
      longitude: -122.43,
    },
  },
  {
    label: 'work',
    radiusMeter: 50,
    coords: {
      latitude: 37.78,
      longitude: -122.4,
    },
  },
  {
    label: 'duboce park stop',
    radiusMeter: 20,
    coords: {
      latitude: 37.76927197100753,
      longitude: -122.43358998608662,
    },
  },
]

function getDistanceInMeters(a: Coordinate, b: Coordinate) {
  // One degree of latitude is 111,139m. One degree of longitude is 40 *
  // cos(latitude) / 360.

  const latDist = 111139 * (a.latitude - b.latitude)
  const lonDist =
    (40075000 / 360) * Math.cos(a.latitude) * (a.longitude - b.longitude)

  return Math.sqrt(latDist * latDist + lonDist * lonDist)
}

export function getLocationLabel(coordinate: Coordinate) {
  for (const place of FELIPE_PLACES) {
    if (getDistanceInMeters(place.coords, coordinate) < place.radiusMeter) {
      return place.label
    }
  }
  return null
}
