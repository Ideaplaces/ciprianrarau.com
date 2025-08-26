import { VFC } from 'react'
import { Check as CheckIcon } from 'react-feather'

export type CheckProps = {
  value?: boolean
  [x: string]: any
}
const Check: VFC<CheckProps> = ({ value, ...props }) => {
  return value ? <CheckIcon {...props} /> : null
}

export default Check
