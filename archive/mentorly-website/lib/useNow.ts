import { useEffect, useState } from 'react'

export const useNow = () => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const getNow = setInterval(() => {
      setNow(new Date())
    }, 1000 * 60)
    return () => {
      clearInterval(getNow)
    }
  }, [])

  return { now }
}
