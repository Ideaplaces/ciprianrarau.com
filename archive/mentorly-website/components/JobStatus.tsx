import { useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'
import { graphql } from 'src/gql'

const getJobStatus = graphql(/* GraphQL */ `
  query getJobStatus($groupId: ID!, $jobId: ID!) {
    group: managedGroup(id: $groupId) {
      jobStatus(id: $jobId) {
        id
        status
      }
    }
  }
`)

type JobStatusProps = {
  className?: string
  groupId: string
  jobId: string
}

const JobStatus = ({ className, groupId, jobId }: JobStatusProps) => {
  const { formatMessage } = useIntl()

  const { data } = useQuery(getJobStatus, {
    variables: { groupId, jobId },
    pollInterval: 10000,
  })

  const status = data?.group?.jobStatus?.status || 'created'

  return (
    <div className={className}>
      <p>{formatMessage({ id: `status.${status}` })}</p>
      {status === 'created' && (
        <p className="text-gray-500 text-sm mt-1">
          *{formatMessage({ id: 'text.matching.timeEstimate' })}
        </p>
      )}
    </div>
  )
}

export default JobStatus
