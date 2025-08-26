import { useFormikContext } from 'formik'
import {
  convertFromOptions,
  convertToOptions,
  SelectProps,
} from 'lib/selectHelpers'
import { useIntl } from 'react-intl'

import Select, { SelectOption } from './ReactSelect'

type SubDisciplinesSelectProps = SelectProps & {
  name: string
  options: readonly SelectOption[]
  [x: string]: any
}
const SubDisciplinesSelect = ({
  name,
  value,
  options,
  ...props
}: SubDisciplinesSelectProps) => {
  const { formatMessage } = useIntl()
  const { setFieldValue } = useFormikContext()

  const handleSelect = (selection: readonly Record<string, any>[]) => {
    setFieldValue(name, selection ? convertFromOptions(options) : [])
  }

  const subdiscipline = formatMessage({ id: 'term.subdisciplines' })
  const placeholder = formatMessage(
    {
      id: 'phrase.selectATerm',
    },
    { term: subdiscipline }
  )

  return (
    <Select
      {...props}
      name={name}
      placeholder={placeholder}
      isMulti={true}
      onChange={handleSelect}
      options={convertToOptions(options)}
      isSearchable={true}
      value={convertToOptions(value)}
    />
  )
}

export default SubDisciplinesSelect
