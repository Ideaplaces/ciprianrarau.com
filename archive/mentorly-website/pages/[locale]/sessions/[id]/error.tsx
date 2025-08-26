import AccessDenied from 'components/AccessDenied'
import { connectServerSideProps } from 'lib/ssg'

export const getServerSideProps = connectServerSideProps(AccessDenied)
export default AccessDenied
