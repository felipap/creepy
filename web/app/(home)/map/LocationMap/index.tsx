'use client'

import { Location } from '@/db/schema'
import { useTheme } from '@/ui/useTheme'
import { withBoundary } from '@/ui/withBoundary'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import Map, { Marker } from 'react-map-gl/mapbox'

const FELIPES_HOUSE = {
  lat: 37.7720410719668,
  lng: -122.4329555421713,
}

const NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''
if (!NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
  throw new Error('NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is not set')
}

interface Props {
  locations: Location[]
}

export const LocationMap = withBoundary(({ locations }: Props) => {
  const theme = useTheme()

  const mapWrapperRef = useRef<HTMLDivElement>(null)
  const { height } = useRefSize(mapWrapperRef)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const sortedLocations = useMemo(() => {
    return [...locations].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
  }, [locations])

  const latestLocation = useMemo(() => {
    if (locations.length === 0) {
      return null
    }
    return sortedLocations[0]
  }, [sortedLocations])

  const oldestLocation = useMemo(() => {
    if (locations.length === 0) {
      return null
    }
    return sortedLocations[sortedLocations.length - 1]
  }, [sortedLocations])

  const center = useMemo(() => {
    return FELIPES_HOUSE

    // if (locations.length === 0) {
    //   return { lat: 37.8, lng: -122.4 }
    // }

    // const locationToUse = selectedDate
    //   ? findClosestLocation(sortedLocations, selectedDate)
    //   : latestLocation

    // if (!locationToUse) {
    //   return { lat: 37.8, lng: -122.4 }
    // }

    // return { lat: locationToUse.latitude, lng: locationToUse.longitude }
  }, [locations, latestLocation, selectedDate])

  const minDate = useMemo(() => {
    if (!oldestLocation) return new Date()
    return new Date(oldestLocation.timestamp)
  }, [oldestLocation])

  const maxDate = useMemo(() => {
    if (!latestLocation) return new Date()
    return new Date(latestLocation.timestamp)
  }, [latestLocation])

  const filteredLocations = useMemo(() => {
    return locations.filter(() => Math.random() < 0.1)
    // .filter(location => {
    //   return dayjs(location.timestamp).isSame(selectedDate, 'day')
    // })
    // .slice(0, 30)
  }, [locations, selectedDate])

  return (
    <div className="flex flex-col h-full">
      <header className="px-3 py-2 flex items-center justify-between text-sm bg-amber-50 text-amber-950">
        <div className="flex flex-row gap-3">
          <div>
            <strong className="font-medium">Locations:</strong>{' '}
            {Number(filteredLocations.length).toLocaleString()}
          </div>
          <div>
            <strong className="font-medium">Center:</strong>
            <span>
              {' '}
              {center.lat.toFixed(8)}, {center.lng.toFixed(8)}
            </span>
          </div>
        </div>
        <div>
          <strong className="font-medium">Latest:</strong>{' '}
          {latestLocation?.timestamp.toISOString() || 'none'}
        </div>
      </header>
      {/* <div className="px-3 pb-2">
        <DateSlider
          minDate={minDate}
          maxDate={maxDate}
          value={selectedDate || maxDate}
          onChange={setSelectedDate}
        />
        {selectedDate && (
          <div className="text-sm text-center mt-1">
            Selected: {selectedDate.toLocaleDateString()}
          </div>
        )}
      </div> */}
      <div className="h-full flex-1" ref={mapWrapperRef}>
        <Map
          mapboxAccessToken={NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          initialViewState={{
            longitude: Number(center.lng),
            latitude: Number(center.lat),
            zoom: 13,
          }}
          style={{ width: '100%', height: height }}
          mapStyle={
            theme === 'dark'
              ? 'mapbox://styles/mapbox/dark-v11'
              : 'mapbox://styles/mapbox/streets-v12'
          }
        >
          {filteredLocations.map((location, index) => {
            const isSelected = selectedDate
              ? findClosestLocation(sortedLocations, selectedDate) === location
              : false
            return (
              <Marker
                key={index}
                longitude={Number(location.longitude)}
                latitude={Number(location.latitude)}
                color={isSelected ? '#FF0000' : '#000000'}
              />
            )
          })}
        </Map>
      </div>
    </div>
  )
})

function findClosestLocation(
  locations: Location[],
  targetDate: Date,
): Location {
  return locations.reduce((prev, curr) => {
    const prevDiff = Math.abs(
      new Date(prev.timestamp).getTime() - targetDate.getTime(),
    )
    const currDiff = Math.abs(
      new Date(curr.timestamp).getTime() - targetDate.getTime(),
    )
    return currDiff < prevDiff ? curr : prev
  })
}

function useRefSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!ref.current) {
      return
    }

    setSize({
      width: ref.current.clientWidth,
      height: ref.current.clientHeight,
    })

    const resizeObserver = new ResizeObserver(() => {
      if (!ref.current) {
        return
      }
      setSize({
        width: ref.current.clientWidth,
        height: ref.current.clientHeight,
      })
    })

    resizeObserver.observe(ref.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [ref.current])

  return size
}
