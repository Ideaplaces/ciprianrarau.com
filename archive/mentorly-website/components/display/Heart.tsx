import classNames from 'classnames'
import { VFC } from 'react'
import { Heart as HeartIcon } from 'react-feather'

export type HeartProps = {
  className?: string
  active?: boolean
}
const Heart: VFC<HeartProps> = ({ className, active }) => {
  return (
    <HeartIcon
      className={classNames(
        'h-4',
        {
          'fill-current text-red': active,
          'text-darkGray': !active,
        },
        className
      )}
    />
  )
}

export default Heart
