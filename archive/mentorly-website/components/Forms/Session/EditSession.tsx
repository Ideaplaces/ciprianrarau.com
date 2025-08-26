import { gql } from '@apollo/client'
import Heading from 'components/Dashboard/Heading'
import { LayoutProps } from 'components/Dashboard/Layout'
import Panel from 'components/display/Panel'
import Alert from 'components/feedback/Alert'
import SessionForm from 'components/Forms/Session'
import { useModal } from 'components/Modal/ModalContext'
import { FormikValues } from 'formik'
import formatMutationVariables from 'lib/formatMutationVariables'
import { useCurrentGroup } from 'lib/GroupContext'
import { useRouter } from 'lib/router'
import { sessionIndexUrl } from 'lib/urls'
import { isEmpty } from 'lodash'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import {
  BookingAttributes,
  Maybe,
  SessionCardFieldsFragment,
  SessionCardFieldsFragmentDoc,
  useGetBookingInfoQuery,
  useUpdateBookingMutation,
} from 'types/graphql'

import ConfirmationModal from './ConfirmationModal'

gql`
  query getBookingInfo($id: ID!, $locale: String) {
    booking(id: $id) {
      ...SessionCardFields
    }
  }
  ${SessionCardFieldsFragmentDoc}

  mutation updateBooking(
    $id: ID!
    $attributes: BookingAttributes!
    $locale: String
  ) {
    updateBooking(id: $id, attributes: $attributes) {
      booking {
        ...SessionCardFields
      }
      errors
      errorDetails
    }
  }
  ${SessionCardFieldsFragmentDoc}
`

type EditSessionSubComponentsProps = {
  Layout: Maybe<VFC<LayoutProps>>
}

type EditSessionForm = {
  onCancel: (...args: any) => void
}

const EditSessionForm: VFC<EditSessionForm> & EditSessionSubComponentsProps = ({
  onCancel,
}) => {
  const { formatMessage, locale } = useIntl()
  const { isDashboard } = useCurrentGroup()
  const { query, push } = useRouter()
  const { showModal } = useModal()

  const [updateBooking] = useUpdateBookingMutation()
  const { loading, data, error } = useGetBookingInfoQuery({
    variables: { id: query.id as string, locale },
    skip: !query.id,
  })

  if (loading) return null

  if (error) {
    console.error('error getting booking: ', error)
    return (
      <Alert className="mb-4" type="error">
        {error}
      </Alert>
    )
  }

  const { booking: session } = data || {}

  if (!session) {
    console.error('cannot find booking for editing')
    toast.error(formatMessage({ id: 'error.unknown' }))
    return null
  }

  const initialValues = {
    title: session.title || '',
    description: session.description,
    startTime: session.startTime,
    duration: session.duration,
    maxParticipants: session.maxParticipants,
    minParticipants: session.minParticipants,
    guests: session.guests,
    hosts: session.hosts,
    mentor: session.mentor,
  }

  const errorHandler = (error: string) => {
    if (error === 'taken') {
      return formatMessage({ id: 'booking.error.conflict' })
    }
    return formatMessage({ id: 'booking.error' })
  }

  const handleSubmit = async (
    values: FormikValues,
    formikBag: FormikValues
  ) => {
    const { setSubmitting } = formikBag

    // @TODO: EditSession and NewSession share similar logic
    // could DRY up and put in shared index.js
    const results = await updateBooking({
      refetchQueries: ['dashboardSessions'],
      variables: {
        id: query.id as string,
        attributes: formatMutationVariables(values, {
          guests: 'id',
          hosts: 'id',
          mentor: 'id',
        }) as BookingAttributes,
      },
    })

    const { errors, errorDetails, booking } = results?.data?.updateBooking || {}

    try {
      setSubmitting(false)
      if (isEmpty(errors)) {
        showModal({
          width: 'sm',
          padding: 'p-8',
          content: (
            <ConfirmationModal booking={booking as SessionCardFieldsFragment} />
          ),
          callback: () => push(sessionIndexUrl(locale, isDashboard)),
        })
      } else {
        errors?.forEach(() => console.error(errorDetails))
        toast.error(errorHandler(errorDetails.start_time[0].error))
      }
    } catch (e: any) {
      setSubmitting(false)
      toast.error(e.message)
      console.error(e)
    }
  }

  return (
    <Panel className="pb-3">
      <Panel.Body>
        <Heading>
          <h2 className="font-black text-xl">
            {formatMessage({ id: 'button.updateSession' })}
          </h2>
        </Heading>
        <SessionForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          enableReinitialize
          booking={session}
          action="edit"
          sessionType={session.sessionType}
        />
      </Panel.Body>
    </Panel>
  )
}

EditSessionForm.Layout = null

export default EditSessionForm
