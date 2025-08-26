import PageContent from 'components/PageContent'
import Panel from 'components/Panel'
import { connectServerSideProps } from 'lib/ssg'
import Head from 'next/head'
import { useIntl } from 'react-intl'

const PrivacyPolicy = () => {
  const { formatMessage } = useIntl()

  return (
    <>
      <Head>
        <title>{formatMessage({ id: 'menu.privacy' })}</title>
      </Head>
      <Panel>
        <Panel.Container>
          <PageContent titlePosition="left" id="privacy" titleSize="h3" />
        </Panel.Container>
      </Panel>
    </>
  )
}

export const getServerSideProps = connectServerSideProps(PrivacyPolicy)
export default PrivacyPolicy
