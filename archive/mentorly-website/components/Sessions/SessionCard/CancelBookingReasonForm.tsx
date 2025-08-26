import Button from 'components/Button'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import Select, { SelectProps } from 'components/controls/Select'
import { FormikState, FormikValues } from 'formik'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import { SessionCardFieldsFragment } from 'types/graphql'
import * as Yup from 'yup'

export type CancellationValueType = {
  reason: {
    value: string
    label: string
  }
  otherReason: string
}

type CancelBookingReasonFormProps = {
  mutation: (
    values: CancellationValueType,
    booking: SessionCardFieldsFragment
  ) => void
  booking: SessionCardFieldsFragment
  options: any
}

const CancelBookingReasonForm: VFC<CancelBookingReasonFormProps> = ({
  mutation,
  booking,
  options,
}) => {
  const { formatMessage } = useIntl()
  const validationSchema = Yup.object().shape({
    reason: Yup.object().required(),
    otherReason: Yup.string().when('reason', {
      is: (val) => val && val.value === 'other',
      then: Yup.string().required().max(100),
      otherwise: Yup.string(),
    }),
  })

  return (
    <Form
      id="camcelBookingReasonForm"
      className="max-w-3xl z-60"
      initialValues={{ reason: '', otherReason: '' }}
      onSubmit={(values) => mutation(values, booking)}
      validationSchema={validationSchema}
    >
      {({ isSubmitting, values }: FormikState<FormikValues>) => (
        <>
          <Field
            name="reason"
            control={(props: SelectProps) => <Select {...props} />}
            className="text-black"
            placeholder={formatMessage({
              id: 'booking.rejectBookingRequest',
            })}
            options={options}
          />
          {values?.reason?.value === 'other' && (
            <Field
              name="otherReason"
              className="text-black"
              autoComplete="off"
            />
          )}
          <Button loading={isSubmitting} type="submit">
            {formatMessage({ id: 'button.confirm' })}
          </Button>
        </>
      )}
    </Form>
  )
}

export default CancelBookingReasonForm
