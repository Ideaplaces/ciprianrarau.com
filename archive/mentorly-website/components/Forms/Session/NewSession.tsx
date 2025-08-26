import { gql } from '@apollo/client'
import Heading from 'components/Dashboard/Heading'
import { LayoutProps } from 'components/Dashboard/Layout'
import DivButtonSelect from 'components/display/DivButtonSelect'
import Panel from 'components/display/Panel'
import ErrorDetails from 'components/Error/ErrorDetails'
import SessionForm from 'components/Forms/Session'
import { useModal } from 'components/Modal/ModalContext'
import SessionPill from 'components/Sessions/SessionPill'
import { FormikValues } from 'formik'
import { useCalendarProps } from 'lib/calendarProps'
import formatMutationVariables from 'lib/formatMutationVariables'
import { useCurrentGroup } from 'lib/GroupContext'
import { useCurrentUser } from 'lib/UserContext'
import { camelCase, capitalize } from 'lodash'
import { useState, VFC } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  BookingAttributes,
  BookingTypeEnum,
  DashboardSessionsDocument,
  Maybe,
  SessionCardFieldsFragment,
  SessionCardFieldsFragmentDoc,
  useAddBookingMutation,
  ViewerBookingsAndRequestsDocument,
} from 'types/graphql'

import ConfirmationModal from './ConfirmationModal'

gql`
  mutation addBooking($attributes: BookingAttributes!, $locale: String) {
    addBooking(attributes: $attributes) {
      booking {
        ...SessionCardFields
      }
      errors
      errorDetails
    }
  }
  ${SessionCardFieldsFragmentDoc}
`

const initialValues = {
  title: '',
  description: '',
  startTime: '',
  duration: 60,
  mentor: '',
  maxParticipants: 100,
  minParticipants: 1,
  guests: [],
  hosts: [],
}

type NewSessionSubComponentsProps = {
  Layout: Maybe<VFC<LayoutProps>>
}

type NewSessionProps = {
  onCancel: (...args: any) => void
}

const NewSession: VFC<NewSessionProps> & NewSessionSubComponentsProps = ({
  onCancel,
}) => {
  const { formatMessage, locale } = useIntl()
  const { currentGroup, isDashboard } = useCurrentGroup()
  const { currentUser } = useCurrentUser()
  const { showModal } = useModal()

  const [sessionType, setSessionType] = useState(
    isDashboard ? 'group_session' : 'masterclass'
  )

  const [addBooking] = useAddBookingMutation()
  const { variables } = useCalendarProps()

  const handleSubmit = async (
    values: FormikValues,
    formikBag: FormikValues
  ) => {
    //@TODO: resetForm should be moved to ConfirmationModal onClose function
    const { resetForm, setSubmitting } = formikBag

    const sessionMentor = values.mentor || currentUser

    const results = await addBooking({
      refetchQueries: [
        {
          query: isDashboard
            ? DashboardSessionsDocument
            : ViewerBookingsAndRequestsDocument,
          variables: isDashboard
            ? { ...variables, locale, groupId: currentGroup.id }
            : { ...variables, locale, segment: 'future' },
        },
      ],
      variables: {
        attributes: formatMutationVariables(
          { ...values, mentor: sessionMentor, sessionType },
          { hosts: 'id', mentor: 'id', guests: 'id' }
        ) as BookingAttributes,
      },
    })

    const { errorDetails, booking } = results?.data?.addBooking || {}

    try {
      setSubmitting(false)
      if (errorDetails) {
        toast.error(<ErrorDetails errorDetails={errorDetails} />)
      } else {
        resetForm()
        showModal({
          width: 'sm',
          padding: 'p-8',
          content: (
            <ConfirmationModal
              booking={
                {
                  ...booking,
                  type: BookingTypeEnum.Booking,
                } as SessionCardFieldsFragment
              }
            />
          ),
        })
      }
    } catch (e: any) {
      setSubmitting(false)
      toast.error(e.message)
      console.error(e)
    }
  }

  const sessionOptions = [
    {
      id: 'group_session',
      content: <SessionPill type="group_session" showIcon showPrivacy />,
      description: 'sessionType.groupSession.description',
    },
    {
      id: 'masterclass',
      content: <SessionPill type="masterclass" showIcon showPrivacy />,
      description: 'sessionType.masterclass.description',
    },
  ]

  return (
    <Panel className="max-w-3xl pr-2">
      <Panel.Body>
        <Heading>
          <h2 className="font-black text-xl">
            {formatMessage({
              id: `header.createA${capitalize(camelCase(sessionType))}`,
            })}
          </h2>
        </Heading>
        {isDashboard && (
          <DivButtonSelect
            headerMessageId={'form.conferenceType'}
            options={sessionOptions}
            selected={sessionType}
            setSelected={setSessionType}
            className="mb-6"
          />
        )}
        <SessionForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          action="create"
          sessionType={sessionType}
        />
      </Panel.Body>
    </Panel>
  )
}

NewSession.Layout = null

export default NewSession
