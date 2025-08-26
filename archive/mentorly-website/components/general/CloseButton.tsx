import classNames from 'classnames'
import { VFC } from 'react'
import { X as CloseIcon } from 'react-feather'

export type CloseButtonProps = {
  className?: string
  onClose?: (...args: any) => void
}

const CloseButton: VFC<CloseButtonProps> = ({ className, onClose }) => {
  return (
    <button onClick={onClose}>
      <CloseIcon
        className={classNames('hover:text-darkerGray', className)}
        size={16}
        strokeWidth={3}
      />
    </button>
  )
}

export default CloseButton
