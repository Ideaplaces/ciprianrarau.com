import Members from 'components/pages/Groups/Members'
import { connectServerSideProps } from 'lib/ssg'

const MentorsPage = () => (
  <main className="h-full w-full">
    <Members />
  </main>
)

export const getServerSideProps = connectServerSideProps(MentorsPage)
export default MentorsPage
