import { useEffect, useState } from 'react'

const useScrollTop = () => {
  const [showScroll, setShowScroll] = useState<boolean>(false)

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const checkScrollTop = () => {
      if (window.pageYOffset > 400) {
        setShowScroll(true)
      } else if (window.pageYOffset <= 400) {
        setShowScroll(false)
      }
    }

    window.addEventListener('scroll', checkScrollTop)

    return () => {
      window.removeEventListener('scroll', checkScrollTop)
    }
  }, [])

  return [showScroll, scrollTop] as const
}

export default useScrollTop
