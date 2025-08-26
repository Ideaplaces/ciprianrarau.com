import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import Spinner from 'components/feedback/Spinner'
import { FormikValues } from 'formik'
import { useCurrentUser } from 'lib/UserContext'
import { useState, VFC } from 'react'
import { Check } from 'react-feather'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { useUpdateUserMutation } from 'types/graphql'
import * as Yup from 'yup'

type EditCalendarUrlProps = {
  fetchRange: {
    startTime: string
    endTime: string
  }
}

const EditCalendarUrl: VFC<EditCalendarUrlProps> = () => {
  const { formatMessage } = useIntl()
  const { currentUser } = useCurrentUser()
  const [checkShowing, setCheckShowing] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [updateUser] = useUpdateUserMutation({
    refetchQueries: ['viewerTimeSlots', 'viewerConnections'],
  })
  const handleSubmit = (
    values: FormikValues['values'],
    formikBag: FormikValues['formikBag']
  ) => {
    updateUser({
      variables: {
        id: currentUser.id,
        attributes: {
          calendarUrl: values.calendarUrl,
        },
      },
    })
      .then(() => {
        toast.success(formatMessage({ id: 'term.saved' }))
        formikBag.setSubmitting(false)
      })
      .catch((e) => {
        console.error(e.message)
        toast.error(formatMessage({ id: 'toast.error.updateUser' }))
        formikBag.setSubmitting(false)
      })
  }

  const handleDisconnect = () => {
    setDisconnecting(true)
    updateUser({
      variables: {
        id: currentUser.id,
        attributes: {
          calendarProvider: '',
          availabilityCalendarId: '',
          calendarId: '',
          calendarUrl: '',
        },
      },
      refetchQueries: ['viewerConnections'],
    })
      .then(() => {
        toast.success(formatMessage({ id: 'term.saved' }))
        setDisconnecting(false)
      })
      .catch((e) => {
        setDisconnecting(false)
        toast.error(
          formatMessage({
            id: 'toast.error.updateUser',
          })
        )
        console.error(e)
      })
  }

  return (
    <div className="w-full -mb-5">
      <Form
        id="editCalendarUrl"
        initialValues={{ calendarUrl: currentUser.calendarUrl }}
        validationSchema={Yup.object().shape({
          calendarUrl: Yup.string().url().required(),
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }: FormikValues) => {
          return (
            <div className="flex items-start">
              <Field
                name="calendarUrl"
                className="flex-grow"
                customChangeHandler={() => setCheckShowing(true)}
              />
              {checkShowing && (
                <button className="border-mediumGray bg-gray hover:bg-lightGray mt-7 ml-2 rounded h-10 w-10 flex items-center justify-center">
                  {isSubmitting ? (
                    <Spinner className="transform scale-50 opacity-75" />
                  ) : (
                    <Check className="text-darkerGray" />
                  )}
                </button>
              )}

              <button
                className="absolute right-4 hover:opacity-75 text-xs border px-2 rounded-full text-red border-red opacity-50 hover:text-red hover:border-red transition duration-150"
                onClick={handleDisconnect}
                disabled={disconnecting}
              >
                {!disconnecting ? (
                  formatMessage({ id: 'button.disconnect' })
                ) : (
                  <div>
                    <Spinner className="w-3 mx-5 py-[2px]" color="red" />
                  </div>
                )}
              </button>
            </div>
          )
        }}
      </Form>
    </div>
  )
}

export default EditCalendarUrl
