import { gql } from '@apollo/client'
import UserProgressHelp from 'components/Dashboard/UserProgressHelp'
import PercentageBars, {
  PercentageBarProps,
} from 'components/display/PercentageBars'
import Help from 'components/Help/Help'
import { VFC } from 'react'
import { useIntl } from 'react-intl'

gql`
  fragment DashboardUserProgressFields on ManagedGroup {
    memberStatusStats
  }
`

type UserProgressProps = {
  memberStatusStats: Record<string, any>
}

const UserProgress: VFC<UserProgressProps> = ({ memberStatusStats }) => {
  const { formatMessage } = useIntl()

  return (
    <>
      <div className="flex space-x-4">
        <ProgressBlock
          data={memberStatusStats.mentors}
          title={formatMessage({ id: 'menu.mentors' })}
        />
        <ProgressBlock
          data={memberStatusStats.mentees}
          title={formatMessage({ id: 'term.mentees' })}
        />
      </div>

      <Help
        linkText={formatMessage({ id: 'userProgress.help.link' })}
        modalContent={<UserProgressHelp />}
      />
    </>
  )
}

type ProgressBlockProps = {
  data: PercentageBarProps[]
  title: string
}
const ProgressBlock: VFC<ProgressBlockProps> = ({ data, title }) => {
  return (
    <div className="border border-darkGray rounded p-3 flex-grow">
      <div className="font-black text-sm tracking-wide mb-1">{title}</div>
      <PercentageBars data={data} />
    </div>
  )
}

export default UserProgress
