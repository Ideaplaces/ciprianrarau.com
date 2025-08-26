import DashboardLayout from 'components/Dashboard/Layout'
import ProgramQuestions from 'components/Matching/ProgramQuestions'
import { useModal } from 'components/Modal/ModalContext'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { useCurrentFullUserQuery } from 'types/graphql'

const Preferences = () => {
  const { data: userData } = useCurrentFullUserQuery()
  const { formatMessage } = useIntl()
  const { hideModal } = useModal()

  return (
    <>
      <h2 className="text-xl pb-5 font-black">
        {formatMessage({ id: 'header.matchingSurvey' })}
      </h2>
      <ProgramQuestions
        onSubmit={() => {
          toast.success(formatMessage({ id: 'toast.success.submitted' }))
          hideModal()
        }}
        user={userData?.viewer}
        mentor={userData?.viewer?.mentor}
        step={3}
        goPrev={() => null}
        formKey="matching"
      />
    </>
  )
}

Preferences.Layout = DashboardLayout
export default Preferences
