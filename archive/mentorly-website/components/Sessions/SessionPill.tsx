import Pill from 'components/display/Pill'
import { sessionColor } from 'lib/sessions'
import { camelCase, snakeCase } from 'lodash'
import { Circle, Globe, Lock, User } from 'react-feather'
import { useIntl } from 'react-intl'

export type Props = {
  type: string
  showIcon?: boolean
  showPrivacy?: boolean
  padding?: number
  stroke?: number
  size?: number
}

export type Icon = {
  type: string
  stroke: number
  size: number
}

const SessionIcon: React.FC<Icon> = ({ type, size, stroke }) => {
  switch (snakeCase(type)) {
    case 'individual_session':
      return <User size={size} {...{ strokeWidth: stroke }} />
    case 'group_session':
      return <Lock size={size} {...{ strokeWidth: stroke }} />
    case 'masterclass':
      return <Globe size={size} {...{ strokeWidth: stroke }} />
    default:
      return <Circle size={size} {...{ strokeWidth: stroke }} />
  }
}

const SessionPill: React.FC<Props> = ({
  type,
  showIcon,
  showPrivacy,
  padding = 1,
  stroke = 2,
  size = 13,
}) => {
  const { formatMessage } = useIntl()

  return (
    <Pill
      className={`flex items-center px-${padding * 3} py-${padding}`}
      color={sessionColor({ sessionType: type })}
    >
      {showIcon && (
        <div className="flex-0 self-center">
          <SessionIcon type={type} size={size} stroke={stroke} />
        </div>
      )}
      <div>{formatMessage({ id: `term.${camelCase(type)}` })}</div>
      {showPrivacy && (
        <div>
          (
          {formatMessage({
            id: type === 'masterclass' ? 'term.public' : 'term.private',
          })}
          )
        </div>
      )}
    </Pill>
  )
}

export default SessionPill
