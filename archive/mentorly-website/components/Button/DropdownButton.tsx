import classNames from 'classnames'
import ConditionalWrapper from 'components/ConditionalWrapper'
import Tooltip from 'components/display/Tooltip'
import Dropdown from 'components/Dropdown/Dropdown'
import Spinner from 'components/feedback/Spinner'
import useClickOutside from 'lib/useClickOutside'
import { isEmpty, startsWith } from 'lodash'
import Link from 'next/link'
import React, { ReactElement, VFC } from 'react'
import { ChevronDown } from 'react-feather'
import { useIntl } from 'react-intl'

type MenuProps = {
  close: () => void
  options: Array<{
    id: string
    href: string
    icon: ReactElement
    data: any
    customComponent: any
    onClick: () => void
    loading: boolean
  }>
}

const Menu: VFC<MenuProps> = ({ close, options }) => {
  const ref = useClickOutside<HTMLDivElement>(close)
  const { formatMessage } = useIntl()
  return (
    <div
      ref={ref}
      className="absolute text-sm bg-white z-10 border border-mediumGray shadow-lg right-0 top-[47px] w-88 rounded-md"
    >
      {options?.map(
        ({ id, href, icon, data, customComponent, onClick, loading }, i) => {
          return (
            <div
              className={classNames(
                'p-3 flex items-center transition duration-150 select-none cursor-pointer',
                {
                  'border-mediumGray border-t': i !== 0,
                  'hover:bg-lightGray': !customComponent,
                }
              )}
              key={id}
              onClick={customComponent ? undefined : close}
            >
              <ConditionalWrapper
                condition={!!href}
                wrapper={(children) => (
                  <Link href={href}>
                    <a target={startsWith(href, 'http') ? '_blank' : '_self'}>
                      {children}
                    </a>
                  </Link>
                )}
              >
                {!isEmpty(customComponent) ? (
                  (customComponent as ReactElement)
                ) : (
                  <div className="flex relative" onClick={onClick || undefined}>
                    <div className="pr-3 pl-1 pt-1 w-12 text-darkerGray">
                      {icon}
                    </div>
                    <div>
                      <div className="font-bold">
                        {formatMessage(
                          { id: `dropdown.${id}.header` },
                          { data }
                        )}
                      </div>
                      <div className="text-evenDarkerGray text-sm">
                        {formatMessage(
                          { id: `dropdown.${id}.description` },
                          { data }
                        )}
                      </div>
                    </div>
                    {loading && (
                      <div className="absolute right-0 transform scale-75">
                        <Spinner />
                      </div>
                    )}
                  </div>
                )}
              </ConditionalWrapper>
            </div>
          )
        }
      )}
    </div>
  )
}

type DropdownButtonProps = {
  mainOption: any
  options: any
  dropdownIcon: any
  className?: string
  noDropdown?: boolean
  disabled?: boolean
  tooltip?: string
}

const DropdownButton: VFC<DropdownButtonProps> = ({
  mainOption,
  options,
  dropdownIcon,
  className,
  noDropdown,
  disabled,
  tooltip,
}) => {
  const noMainOption = !mainOption?.onClick && !mainOption?.href
  const { formatMessage } = useIntl()

  return (
    <Tooltip
      text={tooltip}
      className={disabled ? 'cursor-not-allowed' : undefined}
    >
      <Dropdown
        className={disabled ? 'opacity-40' : undefined}
        trigger={({
          toggle,
          state,
        }: {
          toggle: () => void
          state: boolean
        }) => (
          <div
            className={classNames(className, 'inline-flex cursor-pointer', {
              'border border-darkGray rounded': noMainOption,
              'border-2 border-black rounded-full': !noMainOption,
            })}
          >
            {!noMainOption && (
              <button
                onClick={mainOption.onClick || undefined}
                disabled={disabled}
                className={classNames(
                  'flex items-center transition duration-150 py-2 px-5 justify-center bg-lightGray hover:bg-gray text-black',
                  {
                    'rounded-full': noDropdown || disabled,
                    'rounded-l-full': !noMainOption,
                  }
                )}
              >
                <div className="mr-3">{mainOption.icon}</div>
                <div className="font-bold">
                  {formatMessage({
                    id: `button.availabilities.${mainOption.id}`,
                  })}
                </div>
              </button>
            )}
            {!disabled && !noDropdown && (
              <div
                onClick={toggle || undefined}
                className={classNames(
                  'transition flex items-center duration-150 justify-center',
                  {
                    'w-12 border-l border-darkGray bg-lightGray hover:bg-mediumGray rounded-r-full':
                      !noMainOption,
                    'py-2 px-4 rounded bg-lightGray hover:bg-gray':
                      noMainOption,
                    'bg-mediumGray': state && !noMainOption,
                  }
                )}
              >
                {noMainOption && (
                  <div className="flex items-center select-none py-[2px]">
                    <div className="mr-3">{mainOption.icon}</div>
                    <div className="mr-3 text-sm">{mainOption.id}</div>
                  </div>
                )}
                {dropdownIcon || <ChevronDown size="16" />}
              </div>
            )}
          </div>
        )}
      >
        {({ close }: { close: () => void }) => (
          <Menu close={close} options={options} />
        )}
      </Dropdown>
    </Tooltip>
  )
}

export default DropdownButton
