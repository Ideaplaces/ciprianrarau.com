import classNames from 'classnames'
import { VFC } from 'react'
import { Star as StarIcon } from 'react-feather'

export type StarProps = {
  className?: string
  active?: boolean
}

const Star: VFC<StarProps> = ({ className, active }) => {
  return (
    <StarIcon
      className={classNames(
        'h-4',
        {
          'fill-current text-yellow': active,
          'text-darkGray': !active,
        },
        className
      )}
    />
  )
}

export default Star
