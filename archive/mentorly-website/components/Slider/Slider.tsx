import classNames from 'classnames'
import { Carousel, CustomFlowbiteTheme } from 'flowbite-react'
import { motion } from 'lib/framer-motion'
import { useCurrentGroup } from 'lib/GroupContext'
import * as React from 'react'
import { FC, ReactNode } from 'react'

type SliderProps = {
  children: ReactNode
  className?: string
  dotColor?: string
  [x: string]: any
}

const customTheme: CustomFlowbiteTheme['carousel'] = {
  scrollContainer: {
    base: 'flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth',
    snap: 'snap-x',
  },
}

// @TODO: pause carousel when video is playing AND/OR pause video when carousel advances
export const Slider: FC<SliderProps> = ({ children, ...props }) => {
  return (
    <Carousel
      theme={customTheme}
      leftControl={<></>}
      rightControl={<></>}
      {...props}
    >
      {children}
    </Carousel>
  )
}

type CustomDotProps = {
  onClick?: (props?: any) => void
  active?: boolean
  dotColor?: string
}
export const CustomDot: FC<CustomDotProps> = ({
  onClick,
  active,
  dotColor = 'black',
}) => {
  const { currentGroup } = useCurrentGroup()
  const color = currentGroup.styles?.backgroundColor
    ? 'backgroundColor'
    : dotColor

  return (
    <li>
      <button
        onClick={() => onClick && onClick()}
        className={classNames(
          active ? `bg-${color}` : 'bg-black opacity-15',
          'display-inline-block w-4 h-4 rounded-full mr-2 p-0 transition background 1s'
        )}
      ></button>
    </li>
  )
}

type ArrowProps = {
  onClick?: (props?: any) => void
}
export const PrevArrow: FC<ArrowProps> = ({ onClick }) => {
  return (
    <motion.div
      className="absolute left-0 z-10 flex items-center justify-center cursor-pointer hover:bg-white rounded-full w-8 h-8"
      onClick={() => onClick && onClick()}
      whileTap={{ y: 2 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 15 30"
        className="-ml-1 h-5"
      >
        <path d="M15 27.19L2.81 15 15 2.81V0L0 15l15 15z" />
      </svg>
    </motion.div>
  )
}

export const NextArrow: FC<ArrowProps> = ({ onClick }) => {
  return (
    <motion.div
      className="absolute right-0 z-10 flex items-center justify-center cursor-pointer hover:bg-white rounded-full w-8 h-8"
      onClick={() => onClick && onClick()}
      whileTap={{ y: 2 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 15 30"
        className="-mr-1 h-5"
      >
        <path d="M0 2.81L12.19 15 0 27.19V30l15-15L0 0z" />
      </svg>
    </motion.div>
  )
}

export default Slider
