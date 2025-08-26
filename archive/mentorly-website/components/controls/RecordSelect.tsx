import { useFormikContext } from 'formik'
import {
  convertFromOptions,
  convertToOptions,
  SelectDataType,
} from 'lib/selectHelpers'
import { Maybe } from 'types/graphql'

import ReactSelect, { ReactSelectProps } from './ReactSelect'

type RecordSelectProps<IsMulti extends boolean = false> =
  ReactSelectProps<IsMulti> & {
    dependent?: any
    onValueChange: (option?: SelectDataType) => void
  }

const RecordSelect = <IsMulti extends boolean = false>({
  options,
  onValueChange,
  isMulti,
  value,
  dependent,
  ...props
}: RecordSelectProps<IsMulti>) => {
  const { setFieldValue } = useFormikContext()

  const handleChange = (data: Maybe<SelectDataType>) => {
    // @TODO: limit based on features values
    // i.e. tagLimit
    if (data) {
      onValueChange(convertFromOptions(data, isMulti))
    }

    if (dependent) {
      setFieldValue(dependent, [])
    }
  }

  return (
    <ReactSelect
      {...props}
      onChange={handleChange}
      isMulti={isMulti}
      options={convertToOptions(options, isMulti)}
      value={convertToOptions(value, isMulti)}
    />
  )
}

export default RecordSelect
