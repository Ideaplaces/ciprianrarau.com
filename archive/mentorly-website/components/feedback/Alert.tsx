import classNames from 'classnames'
import CloseButton from 'components/general/CloseButton'
import { FC, ReactNode } from 'react'
import {
  AlertCircle as WarningIcon,
  CheckCircle as SuccessIcon,
  Info as InfoIcon,
  XCircle as ErrorIcon,
} from 'react-feather'

const types = {
  error: {
    borderClassName: 'border-red bg-lightRed',
    iconClassName: 'text-red',
    icon: ErrorIcon,
  },
  info: {
    borderClassName: 'border-blue bg-lightBlue',
    iconClassName: 'text-blue',
    icon: InfoIcon,
  },
  success: {
    borderClassName: 'border-green bg-lightGreen',
    iconClassName: 'text-green',
    icon: SuccessIcon,
    title: 'Success',
  },
  warning: {
    borderClassName: 'border-orange bg-lightOrange',
    iconClassName: 'text-orange',
    icon: WarningIcon,
  },
  subtle: {
    borderClassName: 'border-none bg-gray',
    iconClassName: 'text-evenDarkerGray',
    icon: InfoIcon,
  },
}
export type AlertTypes = 'info' | 'error' | 'success' | 'warning' | 'subtle'

export type AlertProps = {
  children?: ReactNode
  className?: string
  description?: ReactNode
  closable?: boolean
  onClose?: () => void
  showIcon?: boolean
  title?: ReactNode
  type?: AlertTypes
}

const Alert: FC<AlertProps> = ({
  children,
  className,
  description,
  closable,
  onClose,
  showIcon,
  title,
  type = 'info',
}) => {
  if (!children && !description && !title) return null
  const Icon = types[type]?.icon
  const { borderClassName, iconClassName } = types[type] || types.info
  const textColor = 'text-black'

  return (
    <div
      className={classNames(
        'border-l-4 flex pl-4 pr-6 py-3 text-black',
        borderClassName,
        className
      )}
    >
      {showIcon && (
        <div className="my-1 mr-3">
          <Icon className={iconClassName} size={title ? 24 : 16} />
        </div>
      )}
      <div className="w-full">
        {title && (
          <div className={classNames('text-lg leading-8 font-bold', textColor)}>
            {title}
          </div>
        )}
        <div className={textColor}>{children || description}</div>
      </div>
      {closable && (
        <div>
          <CloseButton className={iconClassName} onClose={onClose} />
        </div>
      )}
    </div>
  )
}

export default Alert
