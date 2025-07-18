import { useEffect, useState } from 'react'

// Find theme from media query
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    setTheme(theme as 'light' | 'dark')
  }, [])

  return theme
}
