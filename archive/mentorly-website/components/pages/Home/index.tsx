import { Features } from 'components/pages/Home/Features'
import { Form } from 'components/pages/Home/Form'
import { Hero } from 'components/pages/Home/Hero'
import { Stats } from 'components/pages/Home/Stats'
import { Testimonials } from 'components/pages/Home/Testimonials'
import { VideoPanel } from 'components/pages/Home/Video'
import { Partners } from 'components/pages/Pricing/Partners'
import { SEO } from 'components/SEO/SEO'
import { useCurrentUser } from 'lib/UserContext'
import { isMentorlyUser } from 'lib/userUtils'
import { VFC } from 'react'

import B2BHomePage from './B2BHomePage'

const Home: VFC = () => {
  const { currentUser } = useCurrentUser()

  // Show new B2BHomePage for Mentorly users
  if (isMentorlyUser(currentUser)) {
    return <B2BHomePage />
  }

  // Show original homepage for everyone else
  return (
    <>
      <SEO title="Home" image="images/01.png" />
      <Hero />
      <Partners />
      <Features />
      <Stats />
      <VideoPanel />
      <Testimonials category="b2b" highlight="green" />
      <Form color="yellow" />
    </>
  )
}

export default Home
