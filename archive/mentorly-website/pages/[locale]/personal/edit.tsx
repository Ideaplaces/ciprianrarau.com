import DashboardLayout from 'components/Dashboard/Layout'
import EditSessionForm from 'components/Forms/Session/EditSession'
import { connectServerSideProps } from 'lib/ssg'

EditSessionForm.Layout = DashboardLayout

export const getServerSideProps = connectServerSideProps(EditSessionForm)
export default EditSessionForm
