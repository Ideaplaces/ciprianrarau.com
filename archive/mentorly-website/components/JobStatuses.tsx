import Alert from 'components/feedback/Alert'
import gql from 'graphql-tag'

gql`
  fragment JobStatuses on ManagedGroup {
    jobStatuses {
      id
      status
    }
  }
`

type JobStatusType = {
  id: string
  status: string
}

type JobStatusAlertProps = {
  jobStatuses?: JobStatusType[]
}

const JobStatusAlert = ({ jobStatuses }: JobStatusAlertProps) => {
  if (!jobStatuses || jobStatuses.length == 0) {
    return null
  }

  return (
    <Alert className="mb-4" type="info" showIcon>
      Matching is currently running...
    </Alert>
  )
}

export default JobStatusAlert
