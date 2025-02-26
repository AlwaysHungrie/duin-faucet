import { useState, useEffect } from 'react'

export const useMediaQuery = (query: string): boolean => {
  // Default to false to avoid hydration mismatch since window is not available during SSR
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Create the media query list
    const mediaQuery = window.matchMedia(query)
    
    // Set the initial value
    setMatches(mediaQuery.matches)

    // Create event listener function
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add the listener
    mediaQuery.addEventListener('change', handler)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handler)
    }
  }, [query]) // Re-run effect if query changes

  return matches
} 