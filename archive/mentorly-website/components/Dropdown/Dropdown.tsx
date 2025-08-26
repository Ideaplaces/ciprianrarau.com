import classNames from 'classnames'
import { FC, ReactElement, useState } from 'react'

type DropdownProps = {
  className?: string
  trigger: (props?: any) => ReactElement
  children: (props?: any) => ReactElement
}
const Dropdown: FC<DropdownProps> = ({ className, trigger, children }) => {
  const [state, setState] = useState(false)

  if (!children) return null

  const toggle = () => {
    setState(!state)
  }

  const open = () => {
    setState(true)
  }

  const close = () => {
    setState(false)
  }

  const params = {
    setState,
    open,
    close,
    state,
    toggle,
  }

  return (
    <div className={classNames('relative', className)}>
      {trigger(params)}
      {state && children(params)}
    </div>
  )
}

export default Dropdown
