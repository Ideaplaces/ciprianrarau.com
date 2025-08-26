import Alert from 'components/feedback/Alert'
import { H3 } from 'components/Headings'
import Layout from 'components/pages/Groups/Layout'
import { MentorScheduleCardProps } from 'components/Schedule/MentorCard'
import MentorCardList from 'components/Schedule/MentorCardList'
import { ScheduleProvider } from 'components/Schedule/ScheduleContext'
import ScheduleDatePicker from 'components/Schedule/ScheduleDatePicker'
import ScheduleFilters from 'components/Schedule/ScheduleFilters'
import { addMinutes, endOfDay, max, startOfDay } from 'date-fns'
import gql from 'graphql-tag'
import { programEventBoundaries } from 'lib/date'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import { availabilitiesByUser } from 'lib/timeSlots'
import { useCurrentUser } from 'lib/UserContext'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  BookingLocationFieldsFragmentDoc,
  useScheduleMentorsAvailabilityQuery,
} from 'types/graphql'

gql`
  query scheduleMentorsAvailability(
    $groupId: ID!
    $startTime: ISO8601DateTime
    $endTime: ISO8601DateTime
    $disciplineIds: [ID!]
    $locationId: ID
    $locale: String
  ) {
    group(id: $groupId) {
      id
      availabilitySchedule(
        endTimeAfter: $startTime
        startTimeBefore: $endTime
        disciplineIds: $disciplineIds
        locationId: $locationId
      ) {
        id
        date
        userAvailabilities {
          id
          user {
            id
            group {
              id
              allowGroupSessions
              slug
            }
            bookable
            mentorSessionsRemaining
            avatar {
              id
              color
              imageUrl(width: 45, height: 45)
              initials
            }
            discipline {
              id
              name
            }
            disciplineNames
            experience
            location
            languages {
              id
            }
            mentor
            name
            sessionLengths
            subdisciplineNames
          }
          availabilities {
            id
            startTime
            endTime
            location {
              ...BookingLocationFields
            }
          }
        }
      }
    }
  }
  ${BookingLocationFieldsFragmentDoc}
`

type ScheduleProps = {
  groupId: string
  Layout: any
}
const Schedule = ({ groupId }: ScheduleProps): JSX.Element => {
  const { formatMessage, locale } = useIntl()
  const { currentGroup } = useCurrentGroup()
  const { currentUser } = useCurrentUser()
  const { calendarStart } = programEventBoundaries(currentGroup)

  const hasGroupSetDates = currentGroup?.startsAt && currentGroup.endsAt

  const [activeDate, setActiveDate] = useState(calendarStart)
  const [eventCountForActiveDate, setEventCountForActiveDate] = useState(0)
  const [disciplineFilters, setDisciplineFilters] = useState()
  const [locationFilter, setLocationFilter] = useState()
  const [intervalFilter, setIntervalFilter] = useState([0, 1440])
  const [openMentorCard, setOpenMentorCard] = useState(null)
  const [timeRange, setTimeRange] = useState({
    start: startOfDay(activeDate),
    end: endOfDay(activeDate),
  })
  const sessionLengths = currentGroup?.sessionLengths || []
  const [bookingDuration, setBookingDuration] = useState(
    Math.min(...sessionLengths) || 15
  )
  const [slicedAvailabilities, setSlicedAvailabilities] =
    useState<MentorScheduleCardProps[]>()

  useEffect(() => {
    setTimeRange({
      start: max([
        addMinutes(startOfDay(activeDate), intervalFilter[0]),
        new Date(),
      ]),
      end: max([
        addMinutes(startOfDay(activeDate), intervalFilter[1]),
        new Date(),
      ]),
    })
  }, [activeDate, intervalFilter])

  const variables = {
    groupId: groupId,
    startTime: timeRange.start,
    endTime: timeRange.end,
    disciplineIds: disciplineFilters,
    locationId: locationFilter,
    locale,
  }

  const { loading, error, data, refetch } = useScheduleMentorsAvailabilityQuery(
    {
      variables,
      skip: !hasGroupSetDates || !currentUser || !currentGroup,
    }
  )

  useEffect(() => {
    refetch()
  }, [disciplineFilters, locationFilter, timeRange])

  useEffect(() => {
    if (!loading && !error && data) {
      const sessionLength = Math.min(...sessionLengths) || 15

      const { userAvailabilities } = data?.group?.availabilitySchedule[0] || {}

      if (userAvailabilities && userAvailabilities?.length > 0) {
        const availabilities = availabilitiesByUser(
          userAvailabilities,
          sessionLength
        )

        setSlicedAvailabilities(availabilities)
      }
    }
  }, [data, loading, error])

  if (!hasGroupSetDates) {
    return (
      <div className="p-10">
        <Alert type="error" showIcon>
          {formatMessage({ id: 'error.noStartEndDate' })}
        </Alert>
      </div>
    )
  }

  if (error) {
    console.error(error)
    return <div>{formatMessage({ id: 'form.error' })}</div>
  }

  const scheduleState = {
    activeDate,
    bookingDuration,
    disciplineFilters,
    locationFilter,
    intervalFilter,
    openMentorCard,
    eventCountForActiveDate,
    setEventCountForActiveDate,
    setActiveDate,
    setBookingDuration,
    setDisciplineFilters,
    setLocationFilter,
    setIntervalFilter,
    setOpenMentorCard,
  }

  return (
    <div className="wrapper w-full">
      <div className="container mx-auto py-10">
        <H3 className="py-2 mx-auto">
          {formatMessage({ id: 'header.schedule' })}
        </H3>

        <ScheduleProvider schedule={scheduleState}>
          <div className="flex items-start lg:flex-row flex-col">
            <div className="flex flex-col sm:flex-row lg:flex-col w-full lg:w-96 lg:mr-12">
              <div className="flex flex-0 mr-12 lg:mr-0">
                <ScheduleDatePicker />
              </div>
              <div className="flex flex-1 md:flex-col mb-6 sm:mb-0">
                <ScheduleFilters />
              </div>
            </div>
            <div className="mt-8 lg:mt-0 w-full">
              <MentorCardList
                loading={loading}
                mentors={slicedAvailabilities}
                count={eventCountForActiveDate}
              />
            </div>
          </div>
        </ScheduleProvider>
      </div>
    </div>
  )
}

Schedule.Layout = Layout
export const getServerSideProps = connectServerSideProps(Schedule)
export default Schedule
