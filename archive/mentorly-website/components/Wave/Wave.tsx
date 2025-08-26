import classNames from 'classnames'
import { VFC } from 'react'

import styles from './Wave.module.scss'

type WaveProps = {
  color: string
  flipX?: boolean
}

export const Wave: VFC<WaveProps> = ({ color, flipX }) => {
  return (
    <svg
      className={classNames(
        'fill-current transform align-bottom w-full',
        flipX && '-scale-x-100',
        color,
        styles.wave
      )}
      xmlns="http://www.w3.org/2000/svg"
      y="0"
      x="0"
      viewBox="2 0 660 49"
      preserveAspectRatio="none"
    >
      <path
        fill={color}
        d="M673.673 24.2809C671.099 25.0309 668.547 25.7609 666.006 26.5209C644.743 32.8209 623.117 37.7609 601.018 40.9009C587.488 42.8209 573.914 44.6009 560.285 45.7409C539.407 47.4809 518.463 48.2909 497.486 47.4709C487.333 47.0809 477.158 46.9209 467.038 46.1609C454.498 45.2209 441.98 43.9009 429.495 42.4909C408.353 40.1009 387.387 36.6309 366.795 31.6809C351.978 28.1209 337.348 23.9009 322.707 19.7809C304.161 14.5609 285.395 10.1609 266.233 7.32088C253.616 5.45088 240.966 3.68088 228.261 2.46088C207.196 0.44088 186.032 -0.38912 164.857 0.17088C150.722 0.54088 136.576 1.29088 122.474 2.37088C83.259 5.38088 44.748 11.9009 7.04005 22.2209C4.84005 22.8209 2.66205 23.4809 0.473045 24.1209L0.473022 49.2639H673.673V24.2809Z"
      />
    </svg>
  )
}
