import { useFormikContext } from 'formik'
import { VFC } from 'react'

import Select from './ReactSelect'

type IssuesSelectProps = {
  name: string
  value: any
  options: any
  [x: string]: any
}

const IssuesSelect: VFC<IssuesSelectProps> = ({
  name,
  value,
  options,
  ...props
}) => {
  const { setFieldValue } = useFormikContext()
  const handleChange = (selection: any) => {
    setFieldValue(name, selection)
  }

  return (
    <Select
      {...props}
      borderless={undefined}
      name={name}
      placeholder="Select an issue"
      onChange={handleChange}
      options={options}
      isSearchable={true}
      value={value}
    />
  )
}

export default IssuesSelect
