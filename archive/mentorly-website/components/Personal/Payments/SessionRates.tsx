import Button from 'components/Button'
import Currency from 'components/controls/Currency'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import Panel from 'components/display/Panel'
import QueryError from 'components/Error/QueryError'
import Alert from 'components/feedback/Alert'
import Spinner from 'components/feedback/Spinner'
import { H4 } from 'components/Headings'
import { FormikState, FormikValues } from 'formik'
import { round } from 'lodash'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { useCurrentFullUserQuery, useUpdateUserMutation } from 'types/graphql'
import * as Yup from 'yup'

const SessionRates = () => {
  const { data, loading, error } = useCurrentFullUserQuery()

  const [updateUser] = useUpdateUserMutation({
    refetchQueries: ['currentFullUser'],
  })

  const { formatMessage } = useIntl()

  const initialValues = {
    rate30: data?.viewer?.rates['30'] / 100,
    rate60: data?.viewer?.rates['60'] / 100,
  }

  const handleSubmit = (
    values: FormikValues,
    setSubmitting: (submitting: boolean) => void
  ) => {
    values.rate30 = round(0.6 * values.rate60, 2)
    updateUser({
      variables: {
        attributes: {
          rate30: Number.parseInt(values.rate30) * 100,
          rate60: Number.parseInt(values.rate60) * 100,
        },
        id: data?.viewer?.id as string,
      },
    })
      .then(() => {
        setSubmitting(false)
        toast.success(formatMessage({ id: 'toast.success.submitted' }))
      })
      .catch((err) => {
        toast.error(formatMessage({ id: 'term.error' }), err.message)
        setSubmitting(false)
      })
  }

  const validationSchema = Yup.object().shape({
    rate60: Yup.number().required().max(500),
  })

  if (loading) return <Spinner />
  if (error) return <QueryError error={error} />

  return (
    <Panel>
      <Panel.Body>
        <H4>{formatMessage({ id: 'header.sessionRates' })}</H4>
        <Alert type="subtle" showIcon className="mb-5">
          {formatMessage({ id: 'text.setRates' })}
        </Alert>

        <Form
          id="sessionRates"
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting }) =>
            handleSubmit(values, setSubmitting)
          }
          validationSchema={validationSchema}
        >
          {({ isSubmitting, values }: FormikState<FormikValues>) => {
            return (
              <div className="flex flex-col md:flex-row justify-content-between items-start">
                <div className="flex flex-grow flex-col md:flex-row mr-4">
                  <Field
                    name="rate30"
                    className="md:mr-4 md:min-w-1/2"
                    control={Currency}
                    value={round(0.6 * values.rate60, 2) || 0}
                    disabled
                  />
                  <Field
                    name="rate60"
                    className="md:min-w-1/2"
                    control={Currency}
                  />
                </div>
                <Button
                  type="submit"
                  className="m-0 md:ml-8 md:mt-8"
                  loading={isSubmitting}
                >
                  {formatMessage({ id: 'button.save' })}
                </Button>
              </div>
            )
          }}
        </Form>
      </Panel.Body>
    </Panel>
  )
}

export default SessionRates
