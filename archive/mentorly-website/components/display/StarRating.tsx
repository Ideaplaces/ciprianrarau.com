import classNames from 'classnames'
import { range } from 'lodash'
import { VFC } from 'react'

import Star from './Star'

const stars = range(0, 5)

export type StarRatingProps = {
  className?: string
  rating: number
}

const StarRating: VFC<StarRatingProps> = ({ className, rating }) => {
  return (
    <div className={classNames('flex', className)}>
      {stars.map((star) => (
        <Star key={star} active={rating > star} />
      ))}
    </div>
  )
}

export default StarRating
