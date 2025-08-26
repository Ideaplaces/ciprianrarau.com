import classNames from 'classnames'
import TooltipHelp from 'components/display/TooltipHelp'
import { useFormikContext } from 'formik'
import { filter, includes } from 'lodash'
import { ChangeEvent } from 'react'

type CheckboxSelectProps = {
  name: string
  disabled?: boolean
  value?: any
  className?: string
  testId?: string
  options: Record<string, any>
}

const addValue = (array: string[], value: string) => {
  return [...array, value]
}

const removeValue = (array: string[], value: string) => {
  return filter(array, (v) => v !== value)
}

const CheckboxSelect = ({
  name,
  disabled,
  options,
  value,
  className,
  testId,
}: CheckboxSelectProps) => {
  const { setFieldValue } = useFormikContext()

  const values = Array.isArray(value) ? value : [value]

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const option = options[e.target.value]

    if (e.target.checked) {
      setFieldValue(name, addValue(values, option.value))
    } else {
      setFieldValue(name, removeValue(values, option.value))
    }
  }

  return (
    <div className={classNames(className, 'inline-block')}>
      {options.map((o: any, i: number) => (
        <label key={i} className="flex items-center mb-2">
          <input
            name={name}
            type="checkbox"
            value={i}
            checked={includes(values, o.value)}
            onChange={handleChange}
            disabled={disabled}
            data-testid={testId || name}
          />
          <div className="ml-2 flex items-center space-x-2">
            <p>{o.label}</p> <TooltipHelp name={name} option={o} />
          </div>
        </label>
      ))}
    </div>
  )
}

export default CheckboxSelect
