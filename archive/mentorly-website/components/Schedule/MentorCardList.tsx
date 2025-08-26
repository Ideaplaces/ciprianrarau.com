import MentorCard, {
  MentorScheduleCardProps,
} from 'components/Schedule/MentorCard'
import { times, uniqueId } from 'lodash'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import Skeleton from 'react-loading-skeleton'

type MentorCardListProps = {
  loading?: boolean
  mentors?: MentorScheduleCardProps[]
  count: number
}

const MentorCardList: VFC<MentorCardListProps> = ({
  loading,
  mentors,
  count,
  ...props
}) => {
  const { formatMessage } = useIntl()

  if (!mentors) {
    return (
      <p className="w-full text-center">
        {formatMessage({ id: 'tooltip.noOptionsForSelection' })}
      </p>
    )
  }

  return (
    <div className="grid xl:grid-cols-2 gap-x-5 w-full">
      {loading
        ? times(count || 3, () => (
            <Skeleton
              key={uniqueId()}
              inline
              className="block h-48 mb-6 opacity-40"
            />
          ))
        : mentors?.map(
            ({ availabilities, user }) =>
              availabilities?.length > 0 && (
                <MentorCard
                  key={user.id}
                  availabilities={availabilities}
                  user={user}
                  {...props}
                />
              )
          )}
    </div>
  )
}

export default MentorCardList
