import { motion } from 'lib/framer-motion'
import { FC, ReactNode } from 'react'
import { useInView } from 'react-intersection-observer'

type LazyLoaderProps = {
  children: ReactNode
}

export const LazyLoader: FC<LazyLoaderProps> = ({ children }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  return (
    <motion.div ref={ref} style={{ opacity: inView ? 1 : 0 }}>
      {children}
    </motion.div>
  )
}
