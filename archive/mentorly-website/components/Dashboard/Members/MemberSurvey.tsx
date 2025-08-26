import { gql } from '@apollo/client'
import ProgramQuestions from 'components/Matching/ProgramQuestions'
import {
  MemberSurveyQuery,
  useMemberSurveyQuery,
  UserProgramQuestionFieldsFragmentDoc,
} from 'types/graphql'

gql`
  query memberSurvey($groupId: ID!, $memberId: ID!) {
    group: managedGroup(id: $groupId) {
      id
      member(id: $memberId) {
        id
        ...UserProgramQuestionFields
      }
    }
  }
  ${UserProgramQuestionFieldsFragmentDoc}
`

type MemberSurveyProps = {
  group: MemberSurveyQuery['group']
}

const MemberSurvey = ({ group }: MemberSurveyProps) => {
  const { data, loading } = useMemberSurveyQuery({
    variables: {
      groupId: group?.id as string,
      memberId: group?.member?.id as string,
    },
    skip: !group,
  })

  if (loading) {
    return null
  }

  if (!data?.group?.member) {
    console.error('member survey cannot find user')
    return null
  }

  return (
    <ProgramQuestions
      page="PMDashboard"
      user={data?.group?.member}
      mentor={data?.group?.member?.mentor}
      step={0}
      formKey={''}
      goPrev={function (): void {
        throw new Error('Function not implemented.')
      }}
    />
  )
}

export default MemberSurvey
