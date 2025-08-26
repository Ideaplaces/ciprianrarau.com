import classNames from 'classnames'
import LogoSelect from 'components/general/LogoSelect'
import LanguageDropdown from 'components/LanguageDropdown'
import { useCurrentGroup } from 'lib/GroupContext'
import { FC, useEffect, useState } from 'react'

import HeaderPanel from './HeaderPanel'
import MegaMenu from './MegaMenu'

export type EnhancedHeaderProps = {
  fullscreen?: boolean
  logoLink?: string
  hidePanel?: boolean
  className?: string
}

const EnhancedHeader: FC<EnhancedHeaderProps> = ({
  fullscreen = false,
  logoLink,
  hidePanel = false,
  className,
}) => {
  const [isScrolling, setIsScrolling] = useState(false)
  const { currentGroup, marketplace, isDashboard, isPersonal } =
    useCurrentGroup()
  const isMentorlyGroup = !currentGroup || marketplace

  useEffect(() => {
    if (isMentorlyGroup) {
      const handleScroll = () => {
        setIsScrolling(window.scrollY > 4)
      }
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [isMentorlyGroup])

  return (
    <div
      className={classNames(
        'z-20',
        isMentorlyGroup && 'sticky inset-x-0 top-0 left-0',
        className
      )}
    >
      <nav
        className={classNames(
          'header flex items-center bg-white shadow-sm py-4 transition-opacity duration-200',
          fullscreen ? 'px-8' : 'wrapper',
          isScrolling && 'bg-opacity-95 backdrop-blur-sm'
        )}
      >
        <div
          className={classNames(
            'w-full h-full flex-grow flex items-center justify-between',
            !fullscreen && 'container mx-auto'
          )}
        >
          <LogoSelect
            group={currentGroup}
            logoLink={logoLink}
            isDashboard={isDashboard}
            isPersonal={isPersonal}
          />

          {/* Navigation - responsive */}
          <div className="hidden lg:flex flex-1 justify-center">
            <MegaMenu />
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-4">
              <LanguageDropdown className="font-medium" />
              {!hidePanel && <HeaderPanel group={currentGroup} />}
            </div>
            {/* Mobile menu - only show on mobile */}
            <div className="lg:hidden">
              <MegaMenu mobileOnly />
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default EnhancedHeader
