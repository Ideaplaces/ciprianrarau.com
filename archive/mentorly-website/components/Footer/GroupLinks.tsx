import Feature from 'components/Feature'
import { useCurrentGroup } from 'lib/GroupContext'
import { memberUrl } from 'lib/urls'
import Link from 'next/link'
import React, { VFC } from 'react'
import { useIntl } from 'react-intl'

import HelpCenterLinks from './HelpCenterLinks'

const GroupLinks: VFC = () => {
  const { locale, formatMessage } = useIntl()
  const { currentGroup } = useCurrentGroup()

  return (
    <div className="flex justify-between">
      <div className="flex flex-col sm:block">
        <Feature id="menu.home">
          <Link href={`/${locale}`}>
            <a className="mr-8">{formatMessage({ id: 'menu.home' })}</a>
          </Link>
        </Feature>
        {!currentGroup?.hideMentors && (
          <Link href={`/${locale}${memberUrl(currentGroup)}`}>
            <a className="mr-8">{formatMessage({ id: 'menu.mentors' })}</a>
          </Link>
        )}
        <Feature id="menu.help">
          <HelpCenterLinks />
        </Feature>
      </div>
      <div className="flex space-x-2">
        {/* social links could go here for b2b clients */}
      </div>
    </div>
  )
}

export default GroupLinks
