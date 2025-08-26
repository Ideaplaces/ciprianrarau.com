import classNames from 'classnames'
import { useFormikContext } from 'formik'
import { ChangeEvent } from 'react'
import { useIntl } from 'react-intl'

type ConsentSelectProps = {
  name: string
  disabled?: boolean
  value?: any
  className?: string
  testId?: string
  options: Record<string, any>
}

const ConsentText = ({ answer }: any) => {
  const parts = answer.split('|')

  return (
    <li>
      <a className="underline" href={parts[1]} target="_blank" rel="noreferrer">
        {parts[0]}
      </a>
    </li>
  )
}

const ConsentSelect = ({
  name,
  disabled,
  options,
  className,
  testId,
  value,
}: ConsentSelectProps) => {
  const { formatMessage } = useIntl()
  const { setFieldValue } = useFormikContext()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldValue(name, e.target.checked)
  }

  return (
    <div className={classNames(className, 'inline-block')}>
      <ul className="mb-4 space-y-1">
        {options.map((o: any, i: number) => (
          <ConsentText key={i} answer={o.label} />
        ))}
      </ul>
      <label className="flex items-center mb-2">
        <input
          name={name}
          type="checkbox"
          checked={value}
          onChange={handleChange}
          disabled={disabled}
          data-testid={testId || name}
        />
        <div className="ml-2 flex items-center space-x-2">
          <p>{formatMessage({ id: 'confirm.readAndAccepted' })}</p>
        </div>
      </label>
    </div>
  )
}

export default ConsentSelect
