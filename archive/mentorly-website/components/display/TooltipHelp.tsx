import Tooltip from 'components/display/Tooltip'
import React from 'react'
import { useIntl } from 'react-intl'

export type Props = {
  name?: string
  option?: {
    value: string
  }
  message?: string
  customPlacement?: string
}

const tooltipId = (name: Props['name'], option: Props['option']) => {
  return `form.${name}.${option?.value}.tooltip`
}

const TooltipHelp: React.FC<Props> = ({ name, option, message }) => {
  const { formatMessage, messages } = useIntl()

  if (!messages[tooltipId(name, option)] && !message) return null

  return (
    <Tooltip
      text={
        <div className="max-w-md text-left">
          {formatMessage({ id: message || tooltipId(name, option) })}
        </div>
      }
      hide={false}
    >
      <div className="flex items-center transition-none justify-center h-5 w-5 bg-darkerGray text-white rounded-full cursor-default user-select-none">
        ?
      </div>
    </Tooltip>
  )
}

export default TooltipHelp
