import { ButtonLink } from 'components/Button'
import Heading from 'components/Dashboard/Heading'
import DashboardLayout from 'components/Dashboard/Layout'
import Panel from 'components/display/Panel'
import JobStatus from 'components/JobStatus'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'

const Run = () => {
  const router = useRouter()
  const { formatMessage, locale } = useIntl()
  const { currentGroup } = useCurrentGroup()

  const jobId = router?.query?.id as string | undefined

  if (!jobId) {
    return null
  }

  return (
    <div className="max-w-4xl">
      <Heading>
        <Heading.Text>
          {formatMessage({ id: 'header.automaticMatching' })}
        </Heading.Text>
      </Heading>
      <Panel>
        <Panel.Body>
          <JobStatus
            className="mb-4 text-xl"
            groupId={currentGroup.id}
            jobId={jobId}
          />
          <Link href={`/${locale}/dashboard/matching`}>
            <ButtonLink variant="secondary">
              {formatMessage({ id: 'button.back' })}
            </ButtonLink>
          </Link>
        </Panel.Body>
      </Panel>
    </div>
  )
}

Run.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Run)
export default Run
