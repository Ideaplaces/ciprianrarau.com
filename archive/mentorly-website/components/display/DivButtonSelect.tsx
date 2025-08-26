import classNames from 'classnames'
import Tooltip from 'components/display/Tooltip'
import TooltipHelp from 'components/display/TooltipHelp'
import React, { Dispatch, SetStateAction } from 'react'
import { IntlShape, useIntl } from 'react-intl'

type Option = {
  id: string
  content: React.ReactNode
  description?: string
  tooltip?: string
  [x: string]: any
}

export type DBSProps = {
  headerMessageId?: string
  options: Option[]
  disabled?: string
  selected?: string
  setSelected: Dispatch<SetStateAction<string>>
  hideTitle?: boolean
  className?: string
  buttonPadding?: number
}

const DivButtonSelect: React.FC<DBSProps> = ({
  headerMessageId,
  options,
  selected,
  setSelected,
  hideTitle,
  className,
  buttonPadding,
}) => {
  const { formatMessage }: IntlShape = useIntl()
  const wrapperClass = 'w-full lg:w-1/2 flex flex-col items-start'
  return (
    <div className={classNames('w-full', className)}>
      {!hideTitle && (
        <div className="font-bold mb-2">
          {formatMessage({ id: headerMessageId || 'tooltip.selectAnOption' })}
        </div>
      )}
      <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-2 space-y-2 lg:space-y-0 items-stretch">
        {options.map((option) => (
          <Tooltip
            key={option.id}
            text={option.disabled && formatMessage({ id: option.disabled })}
            hide={false}
            divClass={wrapperClass}
          >
            <button
              type="button"
              onClick={() => !option.disabled && setSelected(option.id)}
              className={classNames(
                'w-full border border-darkGray flex flex-col justify-start rounded hover:bg-gray cursor-pointer items-start',
                buttonPadding ? `p-${buttonPadding}` : `p-5`,
                option.id === selected && 'bg-gray',
                option.disabled ? 'cursor-not-allowed opacity-40' : wrapperClass
              )}
            >
              <span className="w-full flex items-center justify-between">
                {option.content}
                {option.tooltip && (
                  <TooltipHelp
                    message={option.tooltip}
                    customPlacement="BOTTOM_CENTER"
                  />
                )}
              </span>
              {option.description && (
                <span className="w-full mt-2 text-sm text-left text-darkerGray">
                  {formatMessage({ id: option.description })}
                </span>
              )}
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}

export default DivButtonSelect
