import { useEffect, useState } from 'react'

type WindowSizeProps = {
  width: number | undefined
  height: number | undefined
  isMobile: boolean | undefined
  isTablet: boolean | undefined
}

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSizeProps>({
    width: undefined,
    height: undefined,
    isMobile: undefined,
    isTablet: undefined,
  })

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 768,
        isTablet: window.innerWidth < 1024,
      })

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

export default useWindowSize
