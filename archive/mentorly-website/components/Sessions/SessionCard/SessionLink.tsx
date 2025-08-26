import classNames from 'classnames'
import Tooltip from 'components/display/Tooltip'
import { useModal } from 'components/Modal/ModalContext'
import Link from 'next/link'
import { VFC } from 'react'
import { Icon as IconType } from 'react-feather'
import { useIntl } from 'react-intl'

import { SessionCardFormat } from '.'
import sessionMenuOptions, {
  SessionMenuOptionConfigType,
} from './sessionMenuOptions'

export type SessionMenuOptionsType = ReturnType<typeof sessionMenuOptions>

export type SessionLinkProps = {
  format: SessionCardFormat
  onClick: () => void
  triggersModal: (option: keyof SessionMenuOptionsType) => void
  option: keyof SessionMenuOptionsType
  config: SessionMenuOptionConfigType
}

const SessionLink: VFC<SessionLinkProps> = ({
  format,
  onClick,
  triggersModal,
  option,
  config,
}) => {
  const { link, style, Icon, messageId, disabled } = config
  const { hideModal } = useModal()

  const linkClass = classNames(
    link ? 'inline-block' : 'block',
    format === 'dropdown' && 'hover:bg-gray px-3 py-2 w-full',
    format === 'modal' ? 'mt-4 w-full flex-1 mx-auto' : style,
    disabled && 'opacity-25 cursor-default pointer-events-none'
  )

  const message = messageId || `button.${option}`

  if (link) {
    return (
      <Link href={link.url}>
        <a
          className={linkClass}
          onClick={hideModal}
          target={link.newTab ? '_blank' : '_self'}
        >
          <LinkContent format={format} Icon={Icon} messageId={message} />
        </a>
      </Link>
    )
  } else {
    return (
      <button
        className={linkClass}
        onClick={() => {
          onClick()
          triggersModal(option)
        }}
        disabled={disabled}
      >
        <LinkContent format={format} Icon={Icon} messageId={message} />
      </button>
    )
  }
}

type LinkContentProps = {
  messageId: string
  format: SessionCardFormat
  Icon: IconType
}
const LinkContent: VFC<LinkContentProps> = ({ messageId, format, Icon }) => {
  const { formatMessage } = useIntl()
  const iconSize = format === 'modal' ? 28 : 14

  return (
    <span
      className={classNames(
        'relative flex space-x-2 items-center',
        format === 'modal' ? 'justify-center' : 'justify-start'
      )}
    >
      <Tooltip
        distance={100}
        text={formatMessage({ id: messageId })}
        hide={format !== 'modal'}
      >
        <>
          {format !== 'dropdown' && Icon && <Icon size={iconSize} />}
          {format !== 'modal' && <p>{formatMessage({ id: messageId })}</p>}
        </>
      </Tooltip>
    </span>
  )
}

export default SessionLink
