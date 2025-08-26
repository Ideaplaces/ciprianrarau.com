import { timezone } from 'lib/date'
import { Clock, Globe } from 'react-feather'
import { useIntl } from 'react-intl'

const Timezone = () => {
  const { locale } = useIntl()
  return (
    <div className="flex flex-col justify-center items-center opacity-50 text-sm">
      <p className="flex">
        <Globe size={12} />
        <Clock size={12} />
      </p>
      <p className="break-all leading-tight text-center">
        {timezone(new Date(), locale)}
      </p>
    </div>
  )
}

export default Timezone
