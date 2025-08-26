import classNames from 'classnames'
import { useCurrentGroup } from 'lib/GroupContext'
import { FC, useEffect, useRef } from 'react'

import classes from './ProgressRing.module.css'

type ProgressRingProps = {
  icon: any
  percent: number
}

const ProgressRing: FC<ProgressRingProps> = ({ icon, percent }) => {
  const ringRef = useRef<SVGCircleElement>(null)
  const { currentGroup, isDashboard } = useCurrentGroup()
  const Icon = icon
  const iconColor = isDashboard
    ? '#111'
    : currentGroup?.styles?.backgroundTextColor || '#111'

  useEffect(() => {
    if (ringRef?.current) {
      ringRef.current.classList.remove('opacity-0')
      const radius = ringRef.current.r.baseVal.value
      const circumference = radius * 2 * Math.PI
      ringRef.current.style.strokeDasharray = `${circumference} ${circumference}`
      const offset = circumference - (percent / 100) * circumference
      ringRef.current.style.strokeDashoffset = offset.toString()
    }
  }, [percent, ringRef])

  return (
    <div className="rounded-full flex items-center justify-center">
      <Icon className="absolute" color={iconColor} />
      <svg width="60" height="60">
        <circle
          className={classNames(classes.ProgressRingCircle, 'opacity-0')}
          ref={ringRef}
          stroke="#86e0cf"
          strokeWidth="5"
          fill="transparent"
          r="23"
          cx="30"
          cy="30"
        />
      </svg>
    </div>
  )
}

export default ProgressRing
