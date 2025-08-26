import classNames from 'classnames'
import Field from 'components/controls/Field'
import { isArray } from 'lodash'
import { useEffect, useState, VFC } from 'react'
import { useIntl } from 'react-intl'

type RoutingNumberFieldProps = {
  data: any[]
  onChange: (fields: string) => void
}
const RoutingNumberField: VFC<RoutingNumberFieldProps> = ({
  data,
  onChange,
}) => {
  const { formatMessage } = useIntl()
  const [firstField, setFirstField] = useState('')
  const [secondField, setSecondField] = useState('')

  useEffect(() => {
    onChange(`${firstField}${secondField}`)
  }, [firstField, secondField])

  if (!isArray(data)) return null

  const singleField = isArray(data) && data.length !== 2

  return (
    <div className={classNames({ 'md:flex md:mr-4': !singleField })}>
      <Field
        name={data[0].id}
        label={formatMessage({
          id: `stripe.${data[0].id}`,
        })}
        placeholder={data[0].example}
        className={classNames({
          'w-full': singleField,
          'md:mr-4 md:min-w-1/2': !singleField,
        })}
        customChangeHandler={(value: string) => {
          setFirstField(value)
          if (isArray(data) && data.length !== 2) {
            setSecondField('')
          }
        }}
      />
      {!(isArray(data) && data.length !== 2) && (
        <Field
          name={data[1].id}
          label={formatMessage({
            id: `stripe.${data[1].id}`,
          })}
          placeholder={data[1].example}
          className="md:min-w-1/2"
          customChangeHandler={(value: string) => {
            setSecondField(value)
          }}
        />
      )}
    </div>
  )
}

export default RoutingNumberField
