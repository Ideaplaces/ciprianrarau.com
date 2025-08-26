import classNames from 'classnames'
import SessionLink, {
  SessionLinkProps,
  SessionMenuOptionsType,
} from 'components/Sessions/SessionCard/SessionLink'
import useClickOutside from 'lib/useClickOutside'
import { map } from 'lodash'
import { VFC } from 'react'
import { SessionCardMenuFieldsFragment } from 'types/graphql'

import { SessionMenuOptionConfigType } from './sessionMenuOptions'

type SessionCardLinksProps = Omit<SessionLinkProps, 'option' | 'config'> & {
  options: SessionMenuOptionsType
  booking: SessionCardMenuFieldsFragment
}

const SessionCardLinks: VFC<SessionCardLinksProps> = ({
  options,
  onClick,
  format,
  ...props
}) => {
  const ref = useClickOutside<HTMLDivElement>(onClick)

  const dropdownStyle =
    'absolute whitespace-nowrap text-sm bg-white py-1 z-10 rounded border-gray shadow top-0 right-0 mr-8 -mt-2 min-w-full'
  const modalStyle = 'w-full justify-items-stretch flex space-x-4'

  const menuClass = format === 'dropdown' ? dropdownStyle : modalStyle

  return (
    <div
      ref={format === 'dropdown' ? ref : () => null}
      className={classNames('text-left', menuClass)}
    >
      {map(
        options,
        (config, option) =>
          config.show && (
            <div
              key={option}
              className={classNames(format === 'modal' && 'flex-1')}
            >
              <SessionLink
                option={option as keyof SessionMenuOptionsType}
                onClick={onClick}
                format={format}
                config={config as SessionMenuOptionConfigType}
                {...props}
              />
            </div>
          )
      )}
    </div>
  )
}

export default SessionCardLinks
