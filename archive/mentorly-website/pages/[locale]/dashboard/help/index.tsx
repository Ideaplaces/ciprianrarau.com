import DashboardLayout from 'components/Dashboard/Layout'
import HelpPageLayout, { CProps } from 'components/HelpPage'
import { connectServerSideProps } from 'lib/ssg'
import { useIntl } from 'react-intl'

const Index = () => {
  const { formatMessage } = useIntl()
  const collections: CProps[] = [
    {
      href: 'https://help.mentorly.co/en/collections/2593290-program-manager',
      title: formatMessage({ id: 'header.programManager' }),
      subtitle: formatMessage({ id: 'text.resources.managers' }),
      type: 'manager',
    },
    {
      href: 'https://help.mentorly.co/en/collections/807636-program-member',
      title: formatMessage({ id: 'header.programMembers' }),
      subtitle: formatMessage({ id: 'text.resources.members' }),
      type: 'member',
    },
  ]

  return <HelpPageLayout collectionList={collections} />
}

Index.Layout = DashboardLayout
export const getServerSideProps = connectServerSideProps(Index)
export default Index
