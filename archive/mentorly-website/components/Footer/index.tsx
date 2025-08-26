import FooterLogoSelect from 'components/general/FooterLogoSelect'
import LanguageSwitch from 'components/LanguageSwitch'
import { getYear } from 'date-fns'
import { useCurrentGroup } from 'lib/GroupContext'
import { VFC } from 'react'

import GroupLinks from './GroupLinks'
import MentorlyLinks from './MentorlyLinks'

const Footer: VFC = () => {
  const { currentGroup } = useCurrentGroup()

  const { whiteLabel, name, languages, marketplace } = currentGroup || {}

  return (
    <footer className="wrapper bg-lightGray min-h-mobileFooter sm:min-h-footer">
      <div className="pt-10 flex flex-col mx-auto sm:px-0 container">
        {marketplace || !currentGroup ? <MentorlyLinks /> : <GroupLinks />}
        <div className="sm:flex sm:items-center sm:mt-16 sm:space-x-6 h-15">
          <div className="sm:max-w-44 h-full flex sm:items-center justify-center">
            <FooterLogoSelect group={currentGroup} />
          </div>
          <div className="text-center pt-6 sm:pt-0 sm:text-left sm:ml-6">
            <p>
              Copyright &#169; {getYear(new Date())}{' '}
              {whiteLabel ? name : 'Mentorly'}
            </p>
            {languages?.some((l) => l?.code?.includes('fr')) && (
              <LanguageSwitch />
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
