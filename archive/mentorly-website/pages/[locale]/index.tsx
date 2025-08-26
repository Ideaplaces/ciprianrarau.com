import GroupHome from 'components/pages/Groups/Home'
import Marketplace from 'components/pages/Groups/Marketplace'
import B2BHome from 'components/pages/Home'
import { connectServerSideProps } from 'lib/ssg'
import { VFC } from 'react'

type HomeProps = {
  groupId: string
}

const Home: VFC<HomeProps> = ({ groupId }) => {
  if (groupId) {
    return groupId === 'marketplace' ? (
      <Marketplace />
    ) : (
      <GroupHome groupId={groupId} />
    )
  }

  return <B2BHome />
}

export const getServerSideProps = connectServerSideProps(Home)
export default Home
