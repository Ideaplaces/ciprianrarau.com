import Button from 'components/Button'
import Field from 'components/controls/Field'
import Form from 'components/controls/Form'
import initialValues from 'lib/initialValues'
import { VFC } from 'react'
import { useIntl } from 'react-intl'
import * as Yup from 'yup'

type CohortFormProps = {
  row: any
  onSubmit: (...args: any) => void
}

const cohortSchema = Yup.object().shape({
  name: Yup.string().required().max(60),
})

const CohortForm: VFC<CohortFormProps> = ({ row, onSubmit }) => {
  const { formatMessage } = useIntl()
  return (
    <Form
      id="cohortForm"
      initialValues={initialValues(row)}
      validationSchema={cohortSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <>
          <Field name="name" />
          <div className="flex justify-end">
            <Button type="submit">
              {formatMessage({ id: 'button.save' })}
            </Button>
          </div>
        </>
      )}
    </Form>
  )
}

export default CohortForm
