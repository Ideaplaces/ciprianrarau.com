import classNames from 'classnames'
import FormatDateTime from 'components/general/DateTime'
import { isToday, parseISO } from 'date-fns'
import { VFC } from 'react'

type MessageTimeProps = {
  className?: string
  time: string
}

const MessageTime: VFC<MessageTimeProps> = ({ className, time }) => {
  if (!time) {
    return null
  }

  const date = parseISO(time)

  const timeDisplay = isToday(date) ? (
    <FormatDateTime date={date} format="date.time" showTZ />
  ) : (
    <FormatDateTime date={date} format="date.shortDateTime" showTZ />
  )

  return (
    <time className={(classNames('whitespace-nowrap'), className)}>
      {timeDisplay}
    </time>
  )
}

export default MessageTime
