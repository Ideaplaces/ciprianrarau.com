import classNames from 'classnames'
import TooltipHelp from 'components/display/TooltipHelp'
import { useFormikContext } from 'formik'
import { isEqual } from 'lodash'
import { ChangeEvent, FocusEvent, VFC } from 'react'

type RadioSelectProps = {
  name: string
  disabled?: boolean
  value?: any
  className?: string
  testId?: string
  options: RadioSelectOption[]
}

type RadioSelectOption = {
  name: string
  value: any
}

const RadioSelect: VFC<RadioSelectProps> = ({
  name,
  disabled,
  options,
  value,
  className,
  testId,
}) => {
  const { setFieldTouched, setFieldValue } = useFormikContext()

  // todo: is this required?
  const handleBlur = (_e: FocusEvent<HTMLInputElement>) => {
    setFieldTouched(name, true, true)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const o = options[parseInt(e.target.value)]
    setFieldValue(name || '', o.value)
  }

  return (
    <div className={classNames(className, 'inline-block')}>
      {options.map((o, i: number) => (
        <label key={i} className="flex items-center mb-2">
          <input
            name={name}
            type="radio"
            value={i}
            checked={isEqual(value, o.value)}
            onBlur={handleBlur}
            onChange={handleChange}
            disabled={disabled}
            data-testid={testId || name}
          />
          <div className="ml-2 flex items-center space-x-2">
            <p>{o.name}</p> <TooltipHelp name={name} option={o} />
          </div>
        </label>
      ))}
    </div>
  )
}

export default RadioSelect
