import { gql } from '@apollo/client'
import ResponsiveCTAButton from 'components/Button/ResponsiveCTAButton'
import DashboardLayout from 'components/Dashboard/Layout'
import PageMenu from 'components/Dashboard/PageMenu'
import ErrorBoundary from 'components/ErrorBoundary'
import Alert from 'components/feedback/Alert'
import { TabListProps } from 'components/Generic/Tabs'
import Pagination from 'components/navigation/Pagination'
import NextSteps from 'components/Personal/Sessions/NextSteps'
import SessionList, {
  SessionContext,
} from 'components/Personal/Sessions/SessionList'
import { useCurrentGroup } from 'lib/GroupContext'
import { StringParam, useQueryParam } from 'lib/next-query-params'
import { connectServerSideProps } from 'lib/ssg'
import { useCurrentUser } from 'lib/UserContext'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  NextStepsFieldsFragmentDoc,
  SessionCardFieldsFragment,
  SessionCardFieldsFragmentDoc,
  SessionCardRequestFieldsFragmentDoc,
  useViewerBookingsAndRequestsQuery,
  ViewerBookingsAndRequestsQuery,
} from 'types/graphql'

type Viewer = ViewerBookingsAndRequestsQuery['viewer']

// @TODO: don't need ALL BookingFields, choose using co-located fragments
gql`
  query viewerOnboardingProgress {
    viewer {
      id
      mentor
      onboarded
      matchingPercent
      profilePercent
      onboardingPercent
      missingMatchingFields
      missingProfileFields
    }
  }

  query viewerBookingsAndRequests(
    $segment: String
    $locale: String
    $page: Int
    $limit: Int
  ) {
    viewer {
      id
      ...NextStepsFields
      bookingCount(segment: $segment)
      bookings(segment: $segment, page: $page, limit: $limit) {
        ...SessionCardFields
      }
      bookingRequestCount
      bookingRequests(page: $page, limit: $limit) {
        ...SessionCardRequestFields
      }
      unconfirmedBookings(page: $page, limit: $limit) {
        ...SessionCardFields
      }
    }
  }
  ${NextStepsFieldsFragmentDoc}
  ${SessionCardFieldsFragmentDoc}
  ${SessionCardRequestFieldsFragmentDoc}
`

const options = [
  {
    id: 'future',
    value: 'future',
    label: 'button.future',
  },
  {
    id: 'past',
    value: 'past',
    label: 'button.past',
  },
  {
    id: 'cancelled',
    value: 'cancelled',
    label: 'button.cancelled',
  },
]

const processBookings = (viewer: Viewer, segment: SessionContext) => {
  if (!viewer) {
    return []
  }

  const bookings = viewer.bookings || []
  const bookingRequests = viewer.bookingRequests || []
  const unconfirmedBookings = viewer.unconfirmedBookings || []

  if (segment !== 'future') {
    return bookings
  }

  return [
    ...unconfirmedBookings,
    ...bookingRequests,
    ...[...bookings].sort((x, y) => x.startTime - y.startTime),
  ]
}

const Sessions = () => {
  const { currentUser } = useCurrentUser()
  const { currentGroup } = useCurrentGroup()
  const { locale } = useIntl()
  const [tabParam, setTabParam] = useQueryParam('tab', StringParam)

  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [segment, setSegment] = useState<SessionContext>(
    (tabParam as SessionContext) || 'future'
  )

  // Effect to synchronize URL param with state
  useEffect(() => {
    if (tabParam && ['future', 'past', 'cancelled'].includes(tabParam)) {
      setSegment(tabParam as SessionContext)
    }
  }, [tabParam])

  const { loading, error, data } = useViewerBookingsAndRequestsQuery({
    variables: { segment, locale, limit, page },
    skip: !currentUser,
  })

  if (!currentUser) return null

  const switchSegment = ({ id }: TabListProps) => {
    setSegment(id as SessionContext)
    setTabParam(id)
  }

  const MasterclassBtn = () => {
    if (currentUser?.mentor && currentGroup?.allowMasterclasses) {
      return (
        <ResponsiveCTAButton
          path="personal/new"
          messageId="header.hostMasterclass"
        />
      )
    }
    return null
  }

  if (error) {
    console.error('bookingsError: ', error)
    return <Alert type="warning">Error loading data</Alert>
  }

  const viewer = data?.viewer

  const processedBookings = processBookings(viewer, segment)

  return (
    <div className="space-y-4 pb-10 max-w-4xl">
      <NextSteps
        user={viewer}
        hasBookings={!isEmpty(processedBookings)}
        loading={loading}
      />
      <ErrorBoundary>
        <PageMenu
          headerId="header.mySessions"
          CTAbutton={<MasterclassBtn />}
          tabs={options}
          switchTab={switchSegment}
          activeTab={segment}
        />
        <SessionList
          context={segment}
          loading={loading}
          processedBookings={processedBookings as SessionCardFieldsFragment[]}
        />
        <Pagination
          page={page || undefined}
          setPage={setPage}
          per={limit || undefined}
          total={
            (viewer?.bookingCount || 0) + (viewer?.bookingRequestCount || 0)
          }
        />
      </ErrorBoundary>
    </div>
  )
}

Sessions.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Sessions)
export default Sessions
