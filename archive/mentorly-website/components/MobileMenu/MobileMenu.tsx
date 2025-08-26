import { motion, useCycle } from 'lib/framer-motion'
import { useRouter } from 'lib/router'
import { useEffect, VFC } from 'react'
import { GroupEssentialsFieldsFragment } from 'types/graphql'

import { MenuLinkItem } from './MenuItem'
import { MenuToggle } from './MenuToggle'
import { Navigation } from './Navigation'

type MobileMenuProps = {
  data: MenuLinkItem[]
  group: GroupEssentialsFieldsFragment
}
export const MobileMenu: VFC<MobileMenuProps> = ({ data, group }) => {
  const [isOpen, toggleOpen] = useCycle(false, true)
  const { asPath } = useRouter()
  const toggleMenu = () => {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0 // For Safari
    toggleOpen()
  }

  useEffect(() => {
    isOpen && toggleOpen()
  }, [asPath])

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      className={`lg:hidden flex items-center flex-col justify-center`}
    >
      <Navigation
        data={data}
        group={group}
        isOpen={isOpen}
        toggleOpen={toggleOpen}
      />
      <MenuToggle
        toggle={() => toggleMenu()}
        color={group?.styles?.backgroundTextColor}
      />
    </motion.nav>
  )
}
