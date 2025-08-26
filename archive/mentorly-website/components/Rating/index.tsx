import StarRating, { StarRatingProps } from 'components/controls/StarRating'
import { useFormikContext } from 'formik'
import { VFC } from 'react'

// @TODO: there's also a StarRating in 'display'

type RatingProps = StarRatingProps & {
  name: string
  value: number
}

const Rating: VFC<RatingProps> = ({ name, title, value, error }) => {
  const { setFieldValue } = useFormikContext()

  const handleChange = (e: any) => {
    setFieldValue(name, e)
  }

  return (
    <StarRating
      title={title}
      starSize={30}
      rating={value}
      setRating={handleChange}
      error={error}
    />
  )
}

export default Rating
