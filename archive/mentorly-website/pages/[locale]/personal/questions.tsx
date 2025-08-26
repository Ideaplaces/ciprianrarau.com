import DashboardLayout from 'components/Dashboard/Layout'
import Panel from 'components/display/Panel'
import ProgramQuestions from 'components/Matching/ProgramQuestions'
import { connectServerSideProps } from 'lib/ssg'
import { useCurrentUser } from 'lib/UserContext'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { useCurrentFullUserQuery } from 'types/graphql'

const Questions = () => {
  const { currentUser } = useCurrentUser()
  const { data: userData } = useCurrentFullUserQuery({ skip: !currentUser })
  const { formatMessage } = useIntl()

  return (
    <Panel className="max-w-4xl pr-2">
      <Panel.Header>
        {formatMessage({ id: 'header.matchingSurvey' })}
      </Panel.Header>
      <Panel.Body>
        <ProgramQuestions
          onSubmit={() => {
            toast.success(formatMessage({ id: 'toast.success.submitted' }))
          }}
          user={userData?.viewer}
          mentor={userData?.viewer?.mentor}
          step={3}
          goPrev={() => null}
          formKey="matching"
        />
      </Panel.Body>
    </Panel>
  )
}

Questions.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Questions)
export default Questions
