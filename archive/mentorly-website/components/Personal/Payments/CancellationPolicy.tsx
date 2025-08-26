import classNames from 'classnames'
import Button from 'components/Button'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import Panel from 'components/display/Panel'
import Alert from 'components/feedback/Alert'
import Spinner from 'components/feedback/Spinner'
import { H4 } from 'components/Headings'
import RadioSelect from 'components/Select/RadioSelect'
import { FC, ReactNode } from 'react'
import { useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { useCurrentFullUserQuery, useUpdateUserMutation } from 'types/graphql'

type TableElementProps = {
  children?: ReactNode
  bold?: boolean
  bgGray?: boolean
  red?: boolean
  green?: boolean
  orange?: boolean
}

const Th: FC<TableElementProps> = ({ children }) => (
  <th className="border border-darkGray p-2 bg-lightGray">{children}</th>
)
const Td: FC<TableElementProps> = ({
  children,
  bold,
  bgGray,
  red,
  green,
  orange,
}) => (
  <td
    className={classNames(
      'border border-darkGray p-2 text-center bg-lightGray',
      {
        'font-bold': bold,
        'bg-gray': bgGray,
        'text-red': red,
        'text-green': green,
        'text-orange': orange,
      }
    )}
  >
    {children}
  </td>
)

const PolicyTable = () => {
  const { formatMessage } = useIntl()
  return (
    <table className="min-w-80">
      <tbody>
        <tr>
          <Th></Th>
          <Th>
            {'>'} 48 {formatMessage({ id: 'term.hours' }).toLowerCase()}
          </Th>
          <Th>
            12 {formatMessage({ id: 'term.to' })} 48{' '}
            {formatMessage({ id: 'term.hours' }).toLowerCase()}
          </Th>
          <Th>
            {'<'} 12 {formatMessage({ id: 'term.hours' }).toLowerCase()}
          </Th>
        </tr>
        <tr>
          <Td bold bgGray>
            {formatMessage({ id: 'term.flexible' })}
          </Td>
          <Td green>100% {formatMessage({ id: 'term.refund' })}</Td>
          <Td green>100% {formatMessage({ id: 'term.refund' })}</Td>
          <Td orange>75% {formatMessage({ id: 'term.refund' })}</Td>
        </tr>
        <tr>
          <Td bold bgGray>
            {formatMessage({ id: 'term.moderate' })}
          </Td>
          <Td green>100% {formatMessage({ id: 'term.refund' })}</Td>
          <Td orange>50% {formatMessage({ id: 'term.refund' })}</Td>
          <Td red>{formatMessage({ id: 'term.noRefund' })}</Td>
        </tr>
        <tr>
          <Td bold bgGray>
            {formatMessage({ id: 'term.strict' })}
          </Td>
          <Td green>100% {formatMessage({ id: 'term.refund' })}</Td>
          <Td red>{formatMessage({ id: 'term.noRefund' })}</Td>
          <Td red>{formatMessage({ id: 'term.noRefund' })}</Td>
        </tr>
      </tbody>
    </table>
  )
}

const CancellationPolicy = () => {
  const { data, loading, error } = useCurrentFullUserQuery()

  const [updateUser] = useUpdateUserMutation({
    refetchQueries: ['currentFullUser'],
  })

  const { formatMessage } = useIntl()

  const cancellationPolicies = [
    { value: 'flexible', name: formatMessage({ id: 'term.flexible' }) },
    { value: 'moderate', name: formatMessage({ id: 'term.moderate' }) },
    { value: 'strict', name: formatMessage({ id: 'term.strict' }) },
  ]

  const initialValues = {
    cancellationPolicy: data?.viewer?.cancellationPolicy,
  }

  const handleSubmit = (
    values: { cancellationPolicy: any },
    setSubmitting: (submitting: boolean) => void
  ) => {
    updateUser({
      variables: {
        attributes: {
          cancellationPolicy: values.cancellationPolicy,
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

  if (loading) return <Spinner />
  if (error) return <Alert type="error">{error}</Alert>

  return (
    <Panel className="pb-4">
      <Panel.Body>
        <H4 className="">
          {formatMessage({ id: 'header.cancellationPolicy' })}
        </H4>
        <Alert type="subtle" showIcon className="mb-5 pb-5">
          <div className="mb-4">
            {formatMessage({ id: 'text.setCancellationPolicy' })}
          </div>
          <PolicyTable />
        </Alert>

        <Form
          id="cancellationPolicy"
          initialValues={initialValues}
          onSubmit={(values: any, { setSubmitting }) => {
            handleSubmit(values, setSubmitting)
          }}
        >
          {({ isSubmitting }: { isSubmitting: boolean }) => (
            <div className="flex items-end justify-between">
              <Field
                name="cancellationPolicy"
                control={RadioSelect}
                options={cancellationPolicies}
                hideLabel
                className="-mb-1"
              />
              <Button type="submit" loading={isSubmitting} className="mb-2">
                {formatMessage({ id: 'button.save' })}
              </Button>
            </div>
          )}
        </Form>
      </Panel.Body>
    </Panel>
  )
}

export default CancellationPolicy
