import { useFormikContext } from 'formik'
import {
  convertFromOptions,
  convertToOptions,
  SelectProps,
} from 'lib/selectHelpers'
import { useIntl } from 'react-intl'

import Select from './ReactSelect'

type SessionLocationSelectProps = SelectProps & {
  name: string
  options: Array<{
    id: string
    [x: string]: string | number | boolean
  }>
}

const SessionLocationSelect = ({
  name,
  value,
  options,
  ...props
}: SessionLocationSelectProps) => {
  const { formatMessage } = useIntl()
  const { setFieldValue } = useFormikContext()

  const handleChange = (selection: Record<string, any> | null) => {
    if (selection) {
      setFieldValue(name, convertFromOptions(selection))
    }
  }

  const defaultValue = {
    value: null,
    label: formatMessage({ id: 'term.online' }),
  }

  const mappedOptions = convertToOptions(options) || []

  return (
    <Select
      {...props}
      name={name}
      onChange={handleChange}
      options={[defaultValue, ...mappedOptions]}
      isSearchable={true}
      defaultValue={defaultValue}
      value={value ? convertToOptions(value) : defaultValue}
    />
  )
}

export default SessionLocationSelect
