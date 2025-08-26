import { FC } from 'react'

import styles from './VerticalWave.module.scss'

// wrap in parent container with set width and wave will adjust height accordingly
type VerticalWaveProps = {
  className?: string
  color: string
}

export const VerticalWave: FC<VerticalWaveProps> = ({ className, color }) => {
  return (
    <svg
      width="100%"
      height="101%"
      viewBox="0 0 50 674"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`fill-current ${color} ${className} ${styles.wave}`}
      preserveAspectRatio="none"
      style={{ transform: 'rotate(180deg)' }}
    >
      <path
        d="M24.2809 -6.07456e-05C25.0309 2.57394 25.7609 5.12593 26.5209 7.66693C32.8209 28.9299 37.7609 50.556 40.9009 72.655C42.8209 86.185 44.6009 99.7589 45.7409 113.388C47.4809 134.266 48.2909 155.21 47.4709 176.187C47.0809 186.34 46.9209 196.515 46.1609 206.635C45.2209 219.175 43.9009 231.693 42.4909 244.178C40.1009 265.32 36.6309 286.286 31.6809 306.878C28.1209 321.695 23.9009 336.325 19.7809 350.966C14.5609 369.512 10.1609 388.278 7.32088 407.44C5.45088 420.057 3.68088 432.707 2.46088 445.412C0.440883 466.477 -0.389118 487.641 0.170882 508.816C0.540882 522.951 1.29088 537.097 2.37088 551.199C5.38088 590.414 11.9009 628.925 22.2209 666.633C22.8209 668.833 23.4809 671.011 24.1209 673.2L49.2639 673.2L49.2639 -6.04477e-05L24.2809 -6.07456e-05Z"
        fill={color}
      />
    </svg>
  )
}
