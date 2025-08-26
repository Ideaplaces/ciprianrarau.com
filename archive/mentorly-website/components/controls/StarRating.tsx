import classNames from 'classnames'
import Tooltip from 'components/display/Tooltip'
import { range } from 'lodash'
import { VFC } from 'react'
import { Star as StarIcon } from 'react-feather'
import { useIntl } from 'react-intl'

const stars = range(0, 5)

export type StarRatingProps = {
  className?: string
  title: string
  starSize: number
  rating: number
  setRating: (rating: number) => void
  error: boolean
}

const StarRating: VFC<StarRatingProps> = ({
  className,
  title,
  starSize,
  rating,
  setRating,
  error,
}) => {
  const { formatMessage } = useIntl()
  return (
    <button type="button" className={classNames('flex flex-col', className)}>
      <h4 className="text-lg font-black mb-2">{title}</h4>
      <div className="flex flex-row">
        {stars.map((star) => (
          <Tooltip
            key={star}
            hide={star > 2}
            position="top"
            text={formatMessage({ id: 'review.tooltip.review' })}
            className="relative"
          >
            <StarIcon
              key={star}
              onClick={() => {
                setRating(star + 1)
              }}
              size={starSize}
              className={classNames(
                'mx-1 cursor-pointer',
                rating > star ? 'fill-current text-yellow' : 'text-darkGray',
                error && 'text-red'
              )}
            />
          </Tooltip>
        ))}
      </div>
    </button>
  )
}

export default StarRating
