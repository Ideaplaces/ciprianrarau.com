import { gql } from '@apollo/client'
import classNames from 'classnames'
import Feature from 'components/Feature'
import Alert from 'components/feedback/Alert'
import LogoSelect from 'components/general/LogoSelect'
import LanguageDropdown from 'components/LanguageDropdown'
import { MobileMenu } from 'components/MobileMenu'
import OnboardingProgress from 'components/Personal/Onboarding/OnboardingProgress'
import { useCurrentGroup } from 'lib/GroupContext'
import { swapFavicon } from 'lib/swapFavicon'
import { FC, useEffect, useState } from 'react'
import { GroupEssentialsFieldsFragment } from 'types/graphql'

import HeaderPanel from './HeaderPanel'
import Impersonating from './Impersonating'
import { Nav, NavEl, NavElProps, NavProps } from './Nav'

// @TODO: add the requirements from other subcomponents
// LogoSelect
// HeaderPanel
// MobileMenu

gql`
  fragment HeaderFields on Group {
    name
    whiteLabel
    marketplace
    styles {
      backgroundColor
      backgroundTextColor
    }
  }
`

type HeaderSubComponentsProps = {
  Nav?: FC<NavProps>
  NavEl?: FC<NavElProps>
}

export type HeaderProps = {
  group?: GroupEssentialsFieldsFragment
  data?: any[]
  fullscreen?: boolean
  logoLink?: string
  hideMenu?: boolean
  hidePanel?: boolean
  showOnboardingProgress?: boolean
  ignoreGroupStyles?: boolean
  isPreview?: boolean
  [x: string]: any
}

type MainMenuProps = {
  groupContent?: GroupEssentialsFieldsFragment
  data?: any[]
}

const MainMenu = ({ groupContent, data }: MainMenuProps) => {
  return (
    <div className="text-md hidden ml-4 lg:flex lg:ml-6 items-center flex-grow">
      {data?.map((item, i) => (
        <NavEl key={i} group={groupContent} {...item} />
      ))}
    </div>
  )
}

const Header: FC<HeaderProps> & HeaderSubComponentsProps = ({
  group,
  data = [],
  fullscreen = false,
  logoLink,
  hideMenu = false,
  hidePanel = false,
  showOnboardingProgress = false,
  // ignoreGroupStyles = false,
  isPreview = false,
}: HeaderProps) => {
  const [isScrolling, setIsScrolling] = useState(false)
  const { currentGroup, marketplace, isDashboard, isPersonal } =
    useCurrentGroup()
  const isMentorlyGroup = !currentGroup || marketplace
  const groupContent = group || currentGroup

  useEffect(() => {
    swapFavicon(currentGroup)
    window.onscroll = () => {
      isMentorlyGroup && setIsScrolling(window.scrollY < 4 ? false : true)
    }
  }, [])

  const style = {
    backgroundColor:
      isDashboard && !isPreview
        ? undefined
        : groupContent?.styles?.backgroundColor || undefined,
    color:
      isDashboard && !isPreview
        ? undefined
        : groupContent?.styles?.backgroundTextColor || undefined,
    opacity: isScrolling ? '0.9' : 1,
  }

  const showWarning = null

  return (
    <div
      className={classNames(
        'z-20',
        isMentorlyGroup && 'sticky inset-x-0 top-0 left-0 inset-5'
      )}
    >
      {showWarning && (
        <Alert showIcon type="warning">
          {showWarning}
        </Alert>
      )}
      <nav
        className={classNames(
          'header flex items-center bg-backgroundColor py-4',
          groupContent ? 'text-backgroundTextColor' : 'font-bold',
          fullscreen ? 'px-8' : 'wrapper'
        )}
        style={style}
      >
        <div
          className={classNames(
            'w-full h-full flex-grow flex items-center justify-between lg:w-auto',
            !fullscreen && 'container mx-auto'
          )}
        >
          <LogoSelect
            group={currentGroup}
            logoLink={logoLink}
            isDashboard={isDashboard}
            isPersonal={isPersonal}
          />
          {!hideMenu && <MainMenu data={data} groupContent={groupContent} />}
          {!isDashboard && showOnboardingProgress && <OnboardingProgress />}
          <Impersonating />
          <div className="hidden flex-shrink-0 lg:flex self-end items-center text-right my-auto">
            <div className="mr-2">
              <Feature id="languageToggle">
                <LanguageDropdown className="font-black uppercase" />
              </Feature>
            </div>
            {!hidePanel && <HeaderPanel group={groupContent} />}
          </div>
        </div>
        {!hideMenu && <MobileMenu group={groupContent} data={data || []} />}
      </nav>
    </div>
  )
}

Header.Nav = Nav
Header.NavEl = NavEl
export default Header
