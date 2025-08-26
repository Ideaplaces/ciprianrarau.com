import Link from 'next/link'
import { useIntl } from 'react-intl'

import HelpCenterLinks from './HelpCenterLinks'
import SocialLinks from './SocialLinks'

const MentorlyLinks = () => {
  const { locale, formatMessage } = useIntl()
  return (
    <div className="block sm:flex justify-between text-center sm:text-left mb-6">
      <SocialLinks className="sm:hidden block mb-6" />
      <div className="flex flex-col sm:block ">
        <Link href="https://marketplace.mentorly.co/">
          <a className="sm:mr-8">{formatMessage({ id: 'menu.marketplace' })}</a>
        </Link>
        <Link href={`/${locale}/terms`}>
          <a className="sm:mr-8">{formatMessage({ id: 'menu.terms' })}</a>
        </Link>
        <Link href={`/${locale}/privacy-policy`}>
          <a className="sm:mr-8">{formatMessage({ id: 'menu.privacy' })}</a>
        </Link>
        <HelpCenterLinks />
        <Link href={`/${locale}/about`}>
          <a className="sm:mr-8">{formatMessage({ id: 'menu.about' })}</a>
        </Link>
      </div>
      <SocialLinks className="hidden sm:flex" />
    </div>
  )
}

export default MentorlyLinks
