import { ApiLocation, getLocationPage } from '@/api/locations'
import { useEffect, useState } from 'react'

export function useLocationPaginator() {
  const [page, setPage] = useState(1)
  const [locations, setLocations] = useState<ApiLocation[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  async function loadMore() {
    setLoading(true)
    try {
      const newLocations = await getLocationPage(page, 20)
      setHasMore(newLocations.length === 20)
      setPage(page + 1)
      setLocations((prev) => [...prev, ...newLocations])
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMore()
  }, [])

  return {
    page,
    locations,
    loadMore,
    hasMore,
    loading,
  }
}
