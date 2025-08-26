import Feature, { getFeatureFlag } from 'components/Feature'
import { HeaderPanel } from 'components/Header/HeaderPanel'
import LanguageDropdown from 'components/LanguageDropdown'
import { motion } from 'lib/framer-motion'
import useAuth from 'lib/useAuth'
import useClickOutside from 'lib/useClickOutside'
import { useCurrentUser } from 'lib/UserContext'
import { FC } from 'react'
import { LogOut } from 'react-feather'
import { useIntl } from 'react-intl'
import { RemoveScroll } from 'react-remove-scroll'
import { GroupEssentialsFieldsFragment } from 'types/graphql'

import { MenuItem, MenuLink, MenuLinkItem } from './MenuItem'

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    opacity: 1,
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
    opacity: 0,
  },
}

const fadeInOut = {
  open: {
    opacity: 1,
  },
  closed: {
    opacity: 0,
  },
}

const Spacer = () => <hr className="my-4 border-gray" />

type NavItemProps = {
  group: GroupEssentialsFieldsFragment
  item: MenuLinkItem
  toggleOpen: () => void
}

const NavItem: FC<NavItemProps> = ({ group, item, toggleOpen }) => {
  if (item.id == 'menu.dashboard' || !getFeatureFlag(group, item.id)) {
    return null
  }

  return (
    <MenuItem>
      <MenuLink group={group} item={item} toggleOpen={toggleOpen} />
    </MenuItem>
  )
}

type NavigationProps = {
  data: MenuLinkItem[]
  group: GroupEssentialsFieldsFragment
  isOpen: boolean
  toggleOpen: () => void
}

// this is MOBILE navigation
export const Navigation: FC<NavigationProps> = ({
  data,
  group,
  isOpen,
  toggleOpen,
}) => {
  const { logout } = useAuth()
  const { currentUser } = useCurrentUser()
  const { locale, formatMessage } = useIntl()

  const handleLogoutClick = async () => {
    await logout(group?.customDomain)
    window.location.href = `/${locale}`
  }

  const ref = useClickOutside<HTMLUListElement>(toggleOpen)

  return !isOpen ? null : (
    <RemoveScroll>
      <motion.div
        variants={fadeInOut}
        className="z-top mobilenav flex fixed top-0 right-0 bottom-0 w-full bg-black bg-opacity-25 text-black"
      >
        <motion.ul
          variants={variants}
          ref={ref}
          className="shadow-xl overflow-y-scroll text-black w-auto flex-shrink bg-white h-full ml-auto wrapper pt-6 pl-1/12 pr-2/12 "
        >
          <MenuItem className="mb-6" animateOnly noTapMotion>
            <HeaderPanel group={group} toggleOpen={toggleOpen} inline />
          </MenuItem>
          {data.length > 0 && <Spacer />}
          {data.map((item: any, i: number) => (
            <NavItem
              group={group}
              item={item}
              key={i}
              toggleOpen={toggleOpen}
            />
          ))}
          {currentUser && (
            <MenuItem animateOnly>
              <Spacer />
              <button
                className="flex space-x-2 font-bold hover:underline"
                onClick={handleLogoutClick}
              >
                <LogOut />
                <p>{formatMessage({ id: 'menu.signOut' })}</p>
              </button>
            </MenuItem>
          )}
          <Feature id="languageToggle">
            <Spacer />
            <MenuItem animateOnly>
              <LanguageDropdown className="text-black" />
            </MenuItem>
          </Feature>
        </motion.ul>
      </motion.div>
    </RemoveScroll>
  )
}
