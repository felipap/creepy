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
      <span className="text-[13px] text-gray-900 dark:text-gray-100 font-medium w-[150px]">
        At {time}
      </span>
      <span className="text-[13px] text-gray-500 dark:text-gray-400">
        {aLittlePrivacyPlease(parseFloat(location.latitude))}
      </span>
      <span className="text-[13px] text-gray-500 dark:text-gray-400">
        {aLittlePrivacyPlease(parseFloat(location.longitude))}
      </span>
    </li>
  )
}

function aLittlePrivacyPlease(x: number) {
  return (Math.random() * 0.000001 - 0.0000005 + x).toFixed(5)
}
