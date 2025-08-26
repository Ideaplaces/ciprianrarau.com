import ProgressPill from 'components/Dashboard/ProgressPill'
import { VFC } from 'react'
import { useIntl } from 'react-intl'

type StatusDetailsProps = {
  status: string
}

const StatusDetails: VFC<StatusDetailsProps> = ({ status }) => {
  const { formatMessage } = useIntl()
  return (
    <div className="py-2">
      <ProgressPill status={status} className="mr-1" noModal />
      <span className="text-sm">
        {formatMessage({ id: `section.userProgress.${status}` })}
      </span>
    </div>
  )
}

const UserProgressHelp: VFC = () => {
  const { formatMessage } = useIntl()

  const data = [
    // 'pending',
    'invited',
    'signedUp',
    'profileCompleted',
    'onboarded',
    'matched',
    'booked',
  ]

  return (
    <div className="p-10">
      <h3 className="text-2xl font-bold mb-4">
        {formatMessage({ id: 'userProgress.help.header' })}
      </h3>
      {data.map((status) => (
        <StatusDetails status={status} key={status} />
      ))}
    </div>
  )
}

export default UserProgressHelp
