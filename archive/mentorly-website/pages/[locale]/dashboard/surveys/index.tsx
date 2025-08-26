import DashboardLayout from 'components/Dashboard/Layout'
import { useCurrentGroup } from 'lib/GroupContext'
import { connectServerSideProps } from 'lib/ssg'

const Index = () => {
  const { currentGroup } = useCurrentGroup()

  return <div>TODO {currentGroup.id}</div>
}

Index.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Index)
export default Index
