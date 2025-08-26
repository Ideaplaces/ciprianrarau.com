import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { useWindowSize } from 'lib/useWindowSize'
import { useEffect, useRef, useState } from 'react'

export type HSProps = {
  children: React.ReactNode
}

const HorizontalScroller: React.FC<HSProps> = ({ children }) => {
  const [scroll, setScroll] = useState({ showLeft: false, showRight: false })
  const childRef = useRef<HTMLHeadingElement>(null)
  const { width } = useWindowSize()

  const handleScroll = () => {
    const { clientWidth, scrollLeft, scrollWidth } = childRef.current as Element
    const showLeft = scrollLeft > 0
    const showRight = clientWidth + scrollLeft < scrollWidth
    setScroll({ ...scroll, showLeft, showRight })
  }

  useEffect(() => {
    handleScroll()
  }, [width, childRef?.current?.children[0]?.scrollWidth])

  return (
    <div className="relative">
      <AnimatePresence>
        {scroll.showLeft && <Fader position="left" />}
      </AnimatePresence>
      <div onScroll={handleScroll} ref={childRef} className="overflow-x-auto">
        {children}
      </div>
      <AnimatePresence>
        {scroll.showRight && <Fader position="right" />}
      </AnimatePresence>
    </div>
  )
}

export type FProps = {
  position: string
}

const styles: any = {
  left: 'left-0 bg-gradient-to-r',
  right: 'right-0 bg-gradient-to-l',
}

const Fader: React.FC<FProps> = ({ position }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.25 }}
    exit={{ opacity: 0 }}
    transition={{ delay: 0, duration: 0.3 }}
    className={classNames(
      'absolute top-0 h-full w-6 from-black flex flex-col justify-center text-white px-1 z-10',
      position === 'left' ? 'items-start' : 'items-end',
      styles[position]
    )}
  >
    {position === 'left' ? '◀' : '▶'}
  </motion.div>
)

export default HorizontalScroller
