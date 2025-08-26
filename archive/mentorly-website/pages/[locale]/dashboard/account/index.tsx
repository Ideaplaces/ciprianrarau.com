import DashboardLayout from 'components/Dashboard/Layout'
import Panel from 'components/display/Panel'
import { connectServerSideProps } from 'lib/ssg'

const Index = () => {
  return (
    <div>
      <Panel className="pt-4 h-auto">
        <Panel.Body className="h-full drop-shadow-sm">Account</Panel.Body>
      </Panel>
    </div>
  )
}

Index.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Index)
export default Index
