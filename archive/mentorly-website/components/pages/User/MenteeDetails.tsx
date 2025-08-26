import { gql } from '@apollo/client'
import classNames from 'classnames'
import CircleIcon from 'components/display/CircleIcon'
import { getFeatureFlag } from 'components/Feature'
import { useCurrentGroup } from 'lib/GroupContext'
import useWindowSize from 'lib/useWindowSize'
import { VFC } from 'react'
import { Award, CheckCircle } from 'react-feather'
import { useIntl } from 'react-intl'
import { MenteeProfileDetailsFieldsFragment } from 'types/graphql'

gql`
  fragment MenteeProfileDetailsFields on User {
    skills
    shortTermGoals
    longTermGoals
  }
`

type MenteeDetailsProps = {
  mentee: MenteeProfileDetailsFieldsFragment
}

const MenteeDetails: VFC<MenteeDetailsProps> = ({ mentee }) => {
  const { formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()
  return (
    <div>
      {getFeatureFlag(currentGroup, 'userSkills') && (
        <div className="border-2 border-yellow rounded-md p-4 mb-6">
          <h2 className="text-xl font-bold">
            {formatMessage({ id: 'term.soughtAfterSkills' })}
          </h2>
          <p>{mentee.skills || <EmptyField />}</p>
        </div>
      )}
      <div className="flex flex-col mt-6 sm:flex-row space-y-6 sm:space-x-6 sm:space-y-0">
        <GoalBlock
          icon={CheckCircle}
          title={formatMessage({ id: 'term.goals.shortTerm' })}
        >
          {mentee.shortTermGoals}
        </GoalBlock>
        <GoalBlock
          icon={Award}
          title={formatMessage({ id: 'term.goals.longTerm' })}
        >
          {mentee.longTermGoals}
        </GoalBlock>
      </div>
    </div>
  )
}

const GoalBlock = ({ icon, title, children }: any) => {
  const { width }: any = useWindowSize()
  const iconSize = width < 1024 ? 16 : 24
  return (
    <div className="w-full sm:w-1/2">
      <span
        className={classNames(
          'flex mb-2',
          'flex-row justify-start items-center space-x-2',
          'md:mb-4 md:flex-col md:items-start lg:mb-6 lg:flex-row lg:items-center'
        )}
      >
        <CircleIcon icon={icon} size={iconSize} bg="yellow" color="black" />
        <h3 className="text-lg font-bold">{title}</h3>
      </span>
      <p>{children || <EmptyField />}</p>
    </div>
  )
}

const EmptyField = () => {
  const { formatMessage } = useIntl()
  return <em>{formatMessage({ id: 'placeholder.emptyUserField' })}</em>
}

export default MenteeDetails
