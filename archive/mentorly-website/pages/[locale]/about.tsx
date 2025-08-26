import Aboutb2b from 'components/About/Aboutb2b'
import Aboutb2c from 'components/About/Aboutb2c'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'
import { VFC } from 'react'

const About: VFC = () => {
  const { currentGroup } = useCurrentGroup()

  if (currentGroup && currentGroup.slug === 'marketplace') {
    return <Aboutb2c />
  }

  return <Aboutb2b />
}

export const getServerSideProps = connectServerSideProps(About)
export default About
