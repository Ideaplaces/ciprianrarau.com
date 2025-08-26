import Chat from 'components/Chat/Chat'
import DashboardLayout from 'components/Dashboard/Layout'
import { connectServerSideProps } from 'lib/ssg'

Chat.Layout = DashboardLayout

export const getServerSideProps = connectServerSideProps(Chat)
export default Chat
