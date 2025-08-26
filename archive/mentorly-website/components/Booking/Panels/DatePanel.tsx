import { FC } from 'react'
import { useIntl } from 'react-intl'

import Calendar from '../CalendarGrid'

type DatePanelProps = {
  className?: string
}

const DatePanel: FC<DatePanelProps> = ({ className }) => {
  const { formatMessage } = useIntl()

  return (
    <div className="w-auto md:w-6/12 mb-3">
      <h2 className="font-black text-xl mb-2 md:mb-6">
        {formatMessage({ id: 'header.selectDate' })}
      </h2>
      <div className={className}>
        <Calendar />
      </div>
    </div>
  )
}
export default DatePanel
