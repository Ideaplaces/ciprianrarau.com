import BlankLayout from 'components/BlankLayout'
import Maintenance from 'components/statusPage/Maintenance'
import { GetServerSideProps } from 'next'

const MaintenancePage = () => {
  return <Maintenance />
}

MaintenancePage.Layout = BlankLayout
MaintenancePage.maintenance = true

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.statusCode = 503
  return { props: {} }
}

export default MaintenancePage
