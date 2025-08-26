import classNames from 'classnames'
import { FC, ReactElement, useEffect, useRef, useState } from 'react'

type HoverDropdownProps = {
  className?: string
  trigger: (props?: any) => ReactElement
  children: (props?: any) => ReactElement
  hoverDelay?: number
  openDelay?: number
}

const HoverDropdown: FC<HoverDropdownProps> = ({
  className,
  trigger,
  children,
  hoverDelay = 300,
  openDelay = 0,
}) => {
  const [state, setState] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current)
      }
    }
  }, [])

  const toggle = () => {
    setState(!state)
  }

  const open = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setState(true)
  }

  const close = () => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current)
      openTimeoutRef.current = null
    }
    setState(false)
  }

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }

    if (openTimeoutRef.current) {
      return // Don't restart the timer if it's already running
    }

    if (openDelay > 0) {
      openTimeoutRef.current = setTimeout(() => {
        setState(true)
        openTimeoutRef.current = null
      }, openDelay)
    } else {
      setState(true)
    }
  }

  const handleMouseLeave = () => {
    // Cancel any pending open action
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current)
      openTimeoutRef.current = null
    }

    // Add delay before closing to make it easier to move to the menu
    closeTimeoutRef.current = setTimeout(() => {
      setState(false)
      closeTimeoutRef.current = null
    }, hoverDelay)
  }

  const params = {
    setState,
    open,
    close,
    state,
    toggle,
    handleMouseEnter,
    handleMouseLeave,
  }

  return (
    <div
      className={classNames('relative', className)}
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {trigger(params)}
      {state && children(params)}
    </div>
  )
}

export default HoverDropdown
