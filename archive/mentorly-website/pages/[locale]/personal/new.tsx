import DashboardLayout from 'components/Dashboard/Layout'
import NewSessionForm from 'components/Forms/Session/NewSession'
import { connectServerSideProps } from 'lib/ssg'

NewSessionForm.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(NewSessionForm)
export default NewSessionForm
