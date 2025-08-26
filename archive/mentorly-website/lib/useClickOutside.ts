import { useEffect, useRef } from 'react'

type useClickOutsideType = () => void

const useClickOutside = <T extends HTMLElement>(func?: useClickOutsideType) => {
  const ref = useRef<T>(null)

  const handleClickOutside = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
      event.stopPropagation()
      event.preventDefault()
      func && func()
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  })

  return ref
}

export default useClickOutside
