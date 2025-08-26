import CookieConsent from 'components/CookieConsent'
import Footer from 'components/Footer'
import EnhancedHeader from 'components/Header/EnhancedHeader'
import Header from 'components/Header/Header'
import { motion } from 'lib/framer-motion'
import { useCurrentGroup } from 'lib/GroupContext'
import { StringParam, useQueryParam } from 'lib/next-query-params'
import { baseUrl } from 'lib/urls'
import { useCurrentUser } from 'lib/UserContext'
import { isMentorlyUser } from 'lib/userUtils'
import useScrollTop from 'lib/useScrollTop'
import { ReactNode, useEffect, VFC } from 'react'
import { useIntl } from 'react-intl'

const ScrollToTop = () => {
  const [showScroll, scrollTop] = useScrollTop()

  if (!showScroll) {
    return null
  }

  return (
    <button
      className="fixed -right-2 -bottom-2 m-6 font-black bg-white rounded-full w-6 h-6 shadow z-50 focus:outline-none"
      onClick={scrollTop}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  )
}

type LayoutProps = {
  children: ReactNode
}

export const Layout: VFC<LayoutProps> = ({ children }) => {
  const { locale } = useIntl()
  const { currentUser } = useCurrentUser()
  const { currentGroup } = useCurrentGroup()
  const [mentorParam] = useQueryParam('m', StringParam)

  const data = [
    { id: 'menu.home', path: `/`, className: 'hidden xl:block' },
    { id: 'menu.pricing', path: `/pricing` },
    { id: 'menu.caseStudies', path: `/case-studies` },
    {
      id: 'menu.faq',
      path:
        locale === 'fr'
          ? 'https://help.mentorly.co/fr/collections/2780339-faq'
          : 'https://help.mentorly.co/en/collections/2780339-faq',
      legacy: true,
    },
    {
      id: 'menu.blog',
      path: '/blog',
    },
  ]

  useEffect(() => {
    if (mentorParam) {
      const group = currentGroup || currentUser?.group
      const groupBaseUrl = baseUrl(group, locale)
      const redirectUrl = `${groupBaseUrl}/mentors/${mentorParam}` as string
      window.location.href = redirectUrl
    }
  }, [mentorParam])

  return (
    <>
      <motion.div
        initial="initial"
        animate="enter"
        exit="exit"
        variants={{ exit: { transition: { staggerChildren: 0.1 } } }}
        className="animator"
      >
        <div className="w-full">
          {isMentorlyUser(currentUser) ? (
            <EnhancedHeader />
          ) : (
            <Header data={data} />
          )}
          <main className="w-full h-full z-0">{children}</main>
          <Footer />
          <ScrollToTop />
        </div>
        <CookieConsent />
      </motion.div>
    </>
  )
}

export default Layout
