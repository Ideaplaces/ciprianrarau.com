import Layout from 'components/BlankLayout'
import ConferenceWrapper from 'components/ConferenceWrapper'
import Spinner from 'components/feedback/Spinner'
import Redirect from 'components/Redirect'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import { conferenceUrl } from 'lib/urls'
import { useIntl } from 'react-intl'

const Conference = () => {
  const { currentGroup } = useCurrentGroup()
  const { formatMessage, locale } = useIntl()

  return (
    <ConferenceWrapper>
      {(booking) => {
        if (!booking) {
          console.error('no booking found')
          return null
        }

        return (
          <>
            <Redirect
              url={conferenceUrl({
                booking,
                group: currentGroup,
                locale,
              })}
            />
            <div className="mb-4">
              <Spinner color="black" />
            </div>
            <div>{formatMessage({ id: 'alert.redirectToConference' })}</div>
          </>
        )
      }}
    </ConferenceWrapper>
  )
}

Conference.Layout = Layout
export const getServerSideProps = connectServerSideProps(Conference)
export default Conference
