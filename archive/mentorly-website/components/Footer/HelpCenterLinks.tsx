import Link from 'next/link'
import { useIntl } from 'react-intl'

const HelpCenterLinks = () => {
  const { formatMessage, locale } = useIntl()

  const helpUrl =
    locale === 'fr'
      ? 'https://help.mentorly.co/fr'
      : 'https://help.mentorly.co/en'

  return (
    <Link href={helpUrl}>
      <a target="_blank" className="sm:mr-8">
        {formatMessage({ id: 'menu.helpCentre' })}
      </a>
    </Link>
  )
}

export default HelpCenterLinks
