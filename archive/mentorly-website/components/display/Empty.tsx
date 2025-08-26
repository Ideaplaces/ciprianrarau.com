import classNames from 'classnames'
import { VFC } from 'react'
import { Icon, Inbox as InboxIcon } from 'react-feather'
import { useIntl } from 'react-intl'

export type EmptyProps = {
  className?: string
  icon?: Icon
  description?: string
}

const Empty: VFC<EmptyProps> = ({ className, icon, description }) => {
  const { formatMessage } = useIntl()
  const Icon = icon || InboxIcon

  return (
    <div
      className={classNames(
        'flex flex-col items-center justify-center',
        className
      )}
    >
      <div className="mb-2">
        <Icon className="text-darkerGray" size={48} strokeWidth="1" />
      </div>
      <div>{description || formatMessage({ id: 'text.noData' })}</div>
    </div>
  )
}

export default Empty
