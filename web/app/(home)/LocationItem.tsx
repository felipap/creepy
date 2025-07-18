'use client'

import { Location } from '@/db/schema'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export function Item({ location }: { location: Location }) {
  let time
  if (dayjs(location.timestamp).isSame(dayjs(), 'day')) {
    time = dayjs(location.timestamp).format('HH:mm')
  } else {
    time = dayjs(location.timestamp).format('DD/MM/YYYY HH:mm')
  }

  return (
    <li className="flex items-center gap-2">
      <span className="text-[13px] text-gray-500">At {time}</span>
      <span className="text-[13px] text-gray-500">{location.latitude}</span>
      <span className="text-[13px] text-gray-500">{location.longitude}</span>
    </li>
  )
}
